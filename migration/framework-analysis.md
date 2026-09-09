# Framework Analysis

## Scope and source of truth

This analysis covers the source framework under `selenium-framework` only. The Selenium project is treated as the source of truth and remains read-only throughout the migration.

The current implementation is a Java 17 + Maven + Selenium + TestNG + Rest-Assured automation suite with:
- UI tests for login and admin flows
- API tests for a single ReqRes user endpoint
- Browser lifecycle managed by a Selenium driver factory
- Thread-local execution context for browser, environment, and test metadata
- Extent Reports, SLF4J/Logback, screenshot capture, and retry listener logic

This analysis is implementation-based; it does not assume behavior from README text alone when the code says otherwise.

## Repository structure

- `selenium-framework/pom.xml`
- `selenium-framework/src/test/java/com/selenium/testng/base/BaseTest.java`
- `selenium-framework/src/test/java/com/selenium/testng/api/base/BaseApiTest.java`
- `selenium-framework/src/test/java/com/selenium/testng/api/clients/UserApiClient.java`
- `selenium-framework/src/test/java/com/selenium/testng/api/tests/UserApiTest.java`
- `selenium-framework/src/test/java/com/selenium/testng/config/ConfigManager.java`
- `selenium-framework/src/test/java/com/selenium/testng/config/LoggerConfig.java`
- `selenium-framework/src/test/java/com/selenium/testng/context/TestContext.java`
- `selenium-framework/src/test/java/com/selenium/testng/context/ExecutionContext.java`
- `selenium-framework/src/test/java/com/selenium/testng/enums/Menu.java`
- `selenium-framework/src/test/java/com/selenium/testng/listeners/RetryListener.java`
- `selenium-framework/src/test/java/com/selenium/testng/listeners/TestListener.java`
- `selenium-framework/src/test/java/com/selenium/testng/utils/AssertionUtils.java`
- `selenium-framework/src/test/java/com/selenium/testng/utils/ElementActions.java`
- `selenium-framework/src/test/java/com/selenium/testng/utils/LocatorUtil.java`
- `selenium-framework/src/test/java/com/selenium/testng/utils/RetryAnalyzer.java`
- `selenium-framework/src/test/java/com/selenium/testng/utils/ExtentManager.java`
- `selenium-framework/src/test/java/com/selenium/testng/utils/SoftAssertManager.java`
- `selenium-framework/src/test/java/com/selenium/testng/utils/ScreenshotUtil.java`
- `selenium-framework/src/test/java/com/selenium/testng/web/base/BasePage.java`
- `selenium-framework/src/test/java/com/selenium/testng/web/driverfactory/DriverFactory.java`
- `selenium-framework/src/test/java/com/selenium/testng/web/locators/*`
- `selenium-framework/src/test/java/com/selenium/testng/web/pages/*`
- `selenium-framework/src/test/java/com/selenium/testng/web/tests/*`
- `selenium-framework/src/test/resources/config.properties`
- `selenium-framework/src/test/resources/suites/testNG.xml`
- `selenium-framework/src/test/resources/suites/api-smoke.xml`

## Source framework architecture

### 1. Execution layer
- TestNG suite XML definitions and TestNG annotations drive execution.
- Browser and environment parameters are supplied through `@Parameters`.
- `@Listeners` attach reporting and retry behavior.

### 2. Lifecycle/context layer
- `BaseTest` and `BaseApiTest` provide setup/teardown semantics.
- `TestContext` maintains thread-local browser, env, and headless values.
- `ExecutionContext` generates run IDs and artifact paths.
- `ConfigManager` loads properties and exposes QA/PROD URL and API key access.

### 3. Browser layer
- `DriverFactory` creates Chrome, Firefox, Edge, or Safari drivers using Selenium driver classes and options.
- Driver instances are stored in a `ThreadLocal`, with browser setup and teardown in the base classes.

### 4. UI abstraction layer
- `BasePage` provides navigation helpers and wraps `ElementActions`.
- `LoginPage`, `DashboardPage`, and `AdminPage` implement UI business actions.
- Locator classes hold locator strings and dynamic XPath templates.

### 5. API layer
- `BaseApiTest` initializes global Rest-Assured request configuration.
- `UserApiClient` wraps `GET /users/{id}` and logs request/response details.
- `UserApiTest` validates status, data content, and timing.

### 6. Validation/reporting layer
- `AssertionUtils` wraps TestNG assertions and API response checks.
- `SoftAssertManager` keeps thread-local soft assertions.
- `TestListener` creates Extent tests and captures screenshots on failures.
- `ExtentManager` manages the shared report lifecycle.

### 7. Logging layer
- `LoggerConfig` resets Logback and attaches a file appender for the framework package.
- `LoggerUtil` provides loggers used across the framework.

## Technology and dependency inventory

### Core runtime dependencies
- Java 17
- Maven 3 / Surefire
- Selenium Java 4.33.0
- TestNG 7.11.0
- Rest-Assured 5.5.1
- ExtentReports 5.1.2
- SLF4J API 2.0.17
- Logback Classic 1.5.18
- WebDriverManager 6.1.0

### Execution and CI
- GitHub Actions workflow executed with Maven
- `testNG.xml` and `api-smoke.xml` suite definitions
- `parallel="tests"` and `thread-count="4"`

## Framework components

### Shared framework components
- `ConfigManager`
- `LoggerConfig`
- `ExecutionContext`
- `TestContext`
- `DriverFactory`
- `ElementActions`
- `LocatorUtil`
- `AssertionUtils`
- `SoftAssertManager`
- `ScreenshotUtil`
- `ExtentManager`
- `LoggerUtil`
- `RetryAnalyzer`
- `RetryListener`
- `TestListener`
- `BaseTest`
- `BaseApiTest`
- `BasePage`

### UI page objects
- `LoginPage`
- `DashboardPage`
- `AdminPage`

### Locator classes
- `LoginPageLocators`
- `DashboardPageLocators`
- `AdminPageLocators`

### Value enums
- `Menu`

### UI tests
- `LoginTest.verifyLogin`
- `AdminTest.verifyUserExists`

### API tests
- `UserApiTest.verifyUserExists`
- `UserApiTest.verifyUserWithSoftAssertions`

## Page objects

The source implements a small, direct Page Object Model:
- `BasePage` holds the WebDriver and an `ElementActions` helper.
- Page objects are light wrappers around Selenium `By` locators and business actions.
- `LoginPage.loginToPortal(...)` returns a boolean and logs on exception.
- `DashboardPage.clickOnMenu(Menu)` uses dynamic XPath generation.
- `AdminPage.selectFirstUser(role, status)` selects the first user and validates focus class presence.

## UI tests

### `LoginTest.verifyLogin`
- Group: `ui-smoke`
- Uses default base class setup and `driver.get(url)`
- Logs in as `Admin` / `admin123`
- Asserts boolean success for login

### `AdminTest.verifyUserExists`
- Group: `ui-regression`
- Logs in, opens Admin, selects `ESS` / `Enabled`, deletes selected entry, then cancels modal
- Asserts boolean results for each step

## API tests

### `UserApiTest.verifyUserExists`
- Group: `api-smoke`
- Calls `GET /users/2`
- Verifies HTTP 200, first name Janet, response under 2000 ms, email present

### `UserApiTest.verifyUserWithSoftAssertions`
- Group: `api-smoke`
- Uses soft assertions for status, id, non-null data, first name, email domain, and last name
- Calls `assertAll()` at the end

## Test data and configuration

### Config file
`config.properties` contains:
- `browser=chrome`
- `environment=qa`
- `qa.url=https://opensource-demo.orangehrmlive.com/`
- `prod.url=https://opensource-demo.orangehrmlive.com/`
- `qa.api.url=https://reqres.in/api`
- `prod.api.url=https://reqres.in/api`
- `qa.api.key=...` (hard-coded in source property file)

### Test data embedded in code
- UI credentials are hard-coded inside tests: `Admin` / `admin123`
- UI role and status values are hard-coded in `AdminTest`: `ESS` and `Enabled`
- API user ID is hard-coded as `2`

## Browser and environment configuration

### Browser mapping
- `chrome` → `ChromeDriver`
- `firefox` → `FirefoxDriver`
- `edge` → `EdgeDriver`
- `safari` → `SafariDriver`

### Environment mapping
- `qa` and `prod` share the same public UI URL in `config.properties`
- API base URL also mirrors the same public service for both environments

### Headless
- A `headless` parameter is passed through `@BeforeMethod` and used by each driver factory branch

## Reporting, logging, retry mechanisms

### Reporting
- `TestListener` creates an `ExtentTest` for each test and attaches category information for browser and environment.
- `ExtentManager` creates a shared `ExtentReports` instance with a run-specific path.
- Failure screenshots are captured when a driver exists.

### Logging
- `LoggerConfig` configures a framework-specific Logback appender for the package `com.selenium.testng`.
- Request/response logging is performed in the API client.

### Retry mechanism
- `RetryListener` applies `RetryAnalyzer` to every test.
- `RetryAnalyzer.maxRetry = 2`, yielding up to three total attempts.

## Coding standards observed

- Java package-by-feature organization under `com.selenium.testng`.
- Clear class naming using `PascalCase`.
- Method names are descriptive and action-oriented.
- Utility classes are static, behavior-focused, and narrow in responsibility.
- Logging is explicit and embedded in framework logic.
- Test methods are named by business behavior (for example, `verifyLogin`).
- The project uses inheritance for setup and wrappers for shared behavior.

## Design patterns and principles observed

- Page Object Model
- Factory pattern in `DriverFactory`
- Singleton-like configuration manager (`ConfigManager` with lazy static instance)
- ThreadLocal storage for driver, test context, soft assertions, and report state
- Wrapper/facade utility pattern (`ElementActions`, `AssertionUtils`)
- Client pattern for API (`UserApiClient`)
- Base class lifecycle pattern using TestNG hooks
- Annotation transformation for retry behavior

## Missing items

- No explicit project-level migration target directory for the new run yet.
- No target TypeScript project exists under `playwright-framework-v2`.
- No migration implementation has been created for the first analysis phase.
- No explicit source-to-target inventory file beyond the repository migration docs.
- No orchestrated phase documentation for the new run yet.

## Inconsistencies

- Source `config.properties` stores a hard-coded API key in repository-controlled configuration.
- `BaseApiTest` passes a browser parameter but does not use it; the suite still includes a browser value for the API suite.
- `ExtentManager` and `TestListener` mix thread-local and instance-based state; this is a concurrency risk.
- `TestContext` and `DriverFactory` rely on thread-local state while the suite is configured for parallel tests.
- `LoggerConfig` uses logging package-specific configuration but the `README.md` describes broader scalability than the code actually implements.

## REVIEW_REQUIRED items

- Safari-specific browser behavior in Selenium versus Playwright WebKit equivalence.
- Exact `alertIsPresent` and stale-element semantics when translated to Playwright.
- Response-time differences between Rest-Assured and Playwright timing models.
- Full JSONPath semantic parity beyond the observed dot-path usage.
- Source hard-coded credentials and API key security review.
- Live DOM behavior for Admin checkbox focus-class validation and element selection contracts.

## Corrections required

- No implementation defects are being corrected in the analysis phase; this phase is planning only.
- Future migration work must avoid modifying `selenium-framework`.
- Future migration work must document any behavioral differences before implementation decisions are finalized.

## Proposed migration phases

### Phase 0: Framework analysis and planning
- Validate source architecture and migration constraints.
- Confirm read-only source preservation.
- Document dependencies, patterns, and risks.
- Create source-to-target mapping plan.
- Stop after planning; no implementation.

### Phase 1: Foundation setup in `playwright-framework-v2`
- Initialize TypeScript + Playwright project structure.
- Add config, fixtures, context, and test runner setup.
- Preserve QA/PROD config intent without copying secrets into repo.

### Phase 2: Shared framework utilities and core infrastructure
- Port config, execution context, base fixtures, browser lifecycle, assertions, logging, and retry behavior.
- Validate TypeScript and basic discovery.

### Phase 3: Page object migration
- Port `BasePage`, `LoginPage`, `DashboardPage`, `AdminPage`, and locator classes.
- Preserve source selector intent and boolean action contracts.

### Phase 4: UI test migration
- Migrate tests while preserving browser assignment and assertions.
- Run targeted QA validation on intended browser projects.

### Phase 5: API client and API test migration
- Migrate `UserApiClient` and `UserApiTest` behavior, including auth/header handling and timing checks.
- Validate API requests and response assertions.

### Phase 6: Final validation and traceability
- Reconcile missing items, inconsistencies, and REVIEW_REQUIRED items.
- Confirm source protection and final documentation alignment.

## Source-to-target mapping plan

### Framework foundations
- `BaseTest` -> Playwright test fixtures / hooks
- `BaseApiTest` -> API request fixture / request context setup
- `TestContext` -> typed fixture context object
- `ExecutionContext` -> run-scoped artifact metadata
- `ConfigManager` -> env-backed config helper
- `DriverFactory` -> Playwright project/browser lifecycle
- `LoggerConfig` -> Playwright logger or framework logger setup

### Browser and UI layer
- Selenium `WebDriver` -> Playwright `Page` / `BrowserContext`
- `ElementActions` -> Playwright locator actions and `expect`
- `LocatorUtil` -> locator factory preserving dynamic XPath patterns
- `BasePage` -> Playwright page-object base class
- `LoginPage`, `DashboardPage`, `AdminPage` -> equivalent Playwright page objects

### Assertions and reporting
- `AssertionUtils` -> Playwright `expect` and `expect.soft`
- `SoftAssertManager` -> Playwright soft assertions per test
- `ExtentManager` / `TestListener` -> Playwright HTML report, attachments, and failure artifacts
- `ScreenshotUtil` -> Playwright screenshot capture and failure hooks

### API layer
- Rest-Assured globals -> Playwright request contexts and request fixture configuration
- `UserApiClient` -> API client wrapper using Playwright `APIRequestContext`
- API assertions -> Playwright `expect` plus measured request duration

### Source protection and traceability rules
- `selenium-framework` remains read-only throughout the migration.
- Every target component must have a documented relationship to a source component.
- Missing behaviors and unsupported mappings must be explicitly logged as missing/REVIEW_REQUIRED.
- No implementation work begins until the analysis and planning phase is complete and reviewed.

## Analysis status

This phase is complete for the framework analysis and migration planning only. No implementation or migration code has been created. No source files under `selenium-framework` were modified.
