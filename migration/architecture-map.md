# Architecture Map

## Runtime dependency flow

```text
TestNG suite XML / Surefire / GitHub Actions
                 |
                 v
        BaseTest or BaseApiTest
                 |
       +---------+----------+
       |                    |
       v                    v
 TestContext          ConfigManager
       |                    |
       v                    v
 DriverFactory       config.properties
       |
       v
 Selenium WebDriver
       |
       v
 BasePage -> ElementActions -> WebDriverWait / JavaScriptExecutor
       |
       +--> LoginPage
       +--> DashboardPage -> Menu enum + LocatorUtil
       +--> AdminPage -> LocatorUtil

Test classes -> Page objects -> AssertionUtils
                                      |
                         +------------+-------------+
                         |                          |
                         v                          v
                  TestNG Assert                  SoftAssert
                         |                          |
                         +------------+-------------+
                                      v
                                 ExtentManager
                                      |
                                      v
                         TestListener -> screenshot on UI failure

BaseApiTest -> ConfigManager -> RestAssured global baseURI/specification
      |
      v
UserApiTest -> UserApiClient -> ReqRes API
```

## Package responsibility map

| Package           | Responsibility                                                             | Main dependencies                               |
| ----------------- | -------------------------------------------------------------------------- | ----------------------------------------------- |
| `base`          | UI suite lifecycle and driver/context setup/cleanup                        | TestNG, ConfigManager, DriverFactory            |
| `api.base`      | API suite setup and global Rest-Assured configuration                      | TestNG, RestAssured, ConfigManager              |
| `api.clients`   | API endpoint calls and request/response logging                            | Rest-Assured, SLF4J                             |
| `api.tests`     | API scenarios and validations                                              | BaseApiTest, UserApiClient, AssertionUtils      |
| `config`        | Properties loading and Logback setup                                       | Java Properties, Logback, ExecutionContext      |
| `context`       | Thread-local parameters and run artifact paths                             | Java ThreadLocal/date APIs                      |
| `driverfactory` | Browser selection and thread-local WebDriver storage                       | Selenium                                        |
| `web.base`      | Shared page behavior and action wrapper creation                           | Selenium, ElementActions                        |
| `web.pages`     | UI business actions                                                        | BasePage, locator classes, enum/utility classes |
| `web.locators`  | String locator templates/constants                                         | Selenium`By` at use sites                     |
| `web.tests`     | UI workflows                                                               | BaseTest, page objects, AssertionUtils          |
| `utils`         | Actions, assertions, reporting, screenshots, logging, retry, dynamic XPath | Selenium, TestNG, ExtentReports, SLF4J          |
| `listeners`     | Test reporting callbacks and retry annotation transformation               | TestNG, ExtentManager, DriverFactory            |
| `enums`         | Strongly named menu values                                                 | Page objects                                    |

## Lifecycle sequence

### UI test

1. TestNG reads `testNG.xml` and supplies browser, environment, and headless parameters.
2. `@BeforeSuite` calls `LoggerConfig.configure`.
3. `@BeforeMethod` stores a `TestContext`, creates a thread-local WebDriver, resolves the environment URL, and navigates there.
4. `TestListener.onTestStart` creates and stores an Extent test.
5. The test invokes page methods; page methods use explicit waits and return booleans where actions can fail.
6. `AssertionUtils` records validation results in Extent and throws hard failures or accumulates soft failures.
7. Listener marks pass or records failure and captures a screenshot if a driver exists.
8. `@AfterMethod(alwaysRun=true)` quits the driver and removes driver/context thread-local values.
9. `onFinish` flushes the shared report and removes the current thread's Extent test.

### API test

1. TestNG selects `UserApiTest`; `@BeforeClass` in `BaseApiTest` receives `env`.
2. It stores a `TestContext` with null browser/headless values.
3. It assigns global Rest-Assured base URI and request specification.
4. Listener creates an Extent test; the browser category is skipped because browser is null.
5. `UserApiClient` issues `GET /users/{id}` and returns `Response`.
6. Assertion wrappers validate status, JSON paths, response time, and soft assertions.
7. No API-specific teardown removes `TestContext`, resets Rest-Assured globals, or resets soft assertions.

## State ownership and lifetime

| State                        | Owner                                 | Storage                                       | Lifetime                                                                    |
| ---------------------------- | ------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| Browser/environment/headless | `TestContext`                       | `ThreadLocal<TestContext>`                  | UI method or API worker until explicit removal; API has no explicit removal |
| WebDriver                    | `DriverFactory`                     | `ThreadLocal<WebDriver>`                    | UI method, removed in`BaseTest.tearDown`                                  |
| Run ID and artifact paths    | `ExecutionContext`                  | static final timestamp and derived strings    | JVM                                                                         |
| Config properties            | `ConfigManager`                     | lazy static singleton                         | JVM                                                                         |
| Extent report                | `ExtentManager`                     | static`ExtentReports`                       | JVM; never set to null in unload                                            |
| Current Extent test          | `ExtentManager` plus listener field | thread-local slot plus non-thread-local field | Test method/listener instance                                               |
| Soft assertions              | `SoftAssertManager`                 | `ThreadLocal<SoftAssert>`                   | Thread until`reset`/thread termination                                    |
| Rest-Assured base URI/spec   | `BaseApiTest`                       | Rest-Assured static globals                   | JVM/global Rest-Assured state                                               |
| Logs                         | `LoggerConfig`                      | Logback file appender                         | JVM after configuration                                                     |

## Relationships that matter for migration

- UI test classes depend on `BaseTest` for both `driver` injection and navigation to the environment URL.
- Page objects depend on `BasePage`, which creates `ElementActions`; several action methods reach back into `DriverFactory` rather than using only the page's driver.
- `TestListener` assumes `TestContext` has been initialized before `onTestStart` and assumes `ExtentManager.getTest()` is available when assertions run.
- Failure screenshots depend on `DriverFactory.getDriver()` being non-null and the driver implementing `TakesScreenshot`.
- API tests use the same listener and assertion/reporting layer as UI tests but do not create a browser.
- `RetryListener` is registered through `@Listeners` on each base class and changes all test annotations inherited through those bases.
- The suite's parallelism is at TestNG `<test>` level. The code's thread-local state is intended to match that boundary, while report/API globals do not have equivalent isolation.
