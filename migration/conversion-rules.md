# Conversion Rules

These rules are derived from the implemented Selenium framework. They describe preservation requirements for a later migration; they do not create a Playwright implementation.

## Phase 1 foundation decisions

- Use Playwright projects to represent the source's browser/test matrix: a `chrome` project backed by Chromium, `firefox`, `edge` through the `msedge` channel, `safari` backed by WebKit, and a separate API project. The `BROWSER` setting accepts the source names or `all`; Playwright projects are the native replacement for TestNG `<test>` blocks and preserve independent browser/API execution without creating migrated test cases.
- Use environment variables with a checked-in `.env.example` shape instead of copying the source `config.properties` and its API key. Playwright/Node configuration is process-based, and this keeps credentials out of the target repository while preserving `qa`/`prod`, UI/API URL, browser, headless, timeout, and retry concepts.
- Use Playwright's worker/browser-context lifecycle instead of reproducing Selenium's `ThreadLocal<WebDriver>`. The target foundation exposes a typed `TestContext` contract, but browser and request isolation will be supplied by Playwright fixtures when tests are migrated.
- Use Playwright's HTML reporter and artifact directories in the foundation instead of creating an ExtentReports implementation before reporting utilities are migrated. The report remains run-scoped and screenshots/traces/videos are retained on failures through Playwright configuration.
- Configure two retries through Playwright's native `retries` setting, matching the source's maximum of two retries after the initial attempt. CI uses one worker to match the source workflow's conservative CI execution while local runs remain parallel-capable.
- During Phase 1, keep the future `base`, `web`, `api`, `reporting`, and `utils` directories free of placeholder implementations. Those directories now contain only components migrated in later phases.

## Phase 2 core framework decisions

- `ConfigManager` maps to `src/framework/config/config.ts`. It preserves `qa`/`prod`, UI/API URL lookup, browser, headless, timeout, and retry settings. Source URL defaults are retained; API keys are read only from environment variables rather than copied from the source properties file.
- `ExecutionContext` maps to `src/framework/context/execution-context.ts`; run-scoped report, log, screenshot, and test-result paths remain available. `TestContext` maps to a typed fixture value instead of a static `ThreadLocal`, because Playwright owns worker and browser-context isolation.
- `BaseTest` and `BaseApiTest` map to `src/framework/base/test-fixtures.ts`. UI lifecycle is supplied by Playwright's page fixture and project configuration. API setup creates a request-scoped `APIRequestContext` with the configured base URL, JSON content type, and optional `x-api-key`, and disposes it after use rather than mutating Rest-Assured globals.
- `DriverFactory` is intentionally not reproduced. Browser creation and teardown are owned by Playwright projects/fixtures. Source browser names remain as project names; Safari is backed by WebKit and is a `REVIEW_REQUIRED` equivalence.
- `BasePage` maps to `src/framework/web/base-page.ts` and receives a Playwright `Page`. Navigation methods are asynchronous and use Playwright page methods; no PageFactory architecture is introduced.
- `ElementActions` maps to `src/framework/utils/element-actions.ts`. Locator actions use Playwright auto-waiting; explicit 10-second waits remain where the source exposed a wait contract, and web-first assertions are used for visibility/enabled/hidden state.
- `LocatorUtil` maps to `src/framework/utils/locator.ts` and preserves the source's `%s` dynamic XPath template behavior. It returns a selector string for `page.locator`, rather than a Selenium `By` object.
- `AssertionUtils` maps to `src/framework/utils/assertions.ts`. Hard assertions use Playwright `expect`; soft assertions use `expect.soft`, so `assertAll()` is intentionally a no-op because Playwright reports soft failures through the active test. API response JSON access is asynchronous and currently supports the source's dot-separated paths.
- `SoftAssertManager` is intentionally not reproduced as a thread-local object. Playwright's test-scoped `expect.soft` state provides the equivalent isolation.
- `ScreenshotUtil` maps to `src/framework/utils/screenshot.ts`; Playwright configuration already captures failure screenshots, while the utility supports explicit full-page screenshots with run-scoped paths.
- `LoggerUtil` and `LoggerConfig` map to `src/framework/utils/logger.ts`. A small file/stdout logger preserves the source's run-scoped framework log intent without reproducing Logback configuration or SLF4J classes.
- `ExtentManager` and `TestListener` are replaced by Playwright's native HTML reporter, failure artifacts, and `TestReporter`. The reporter fixture attaches framework step summaries to the active test and avoids the source listener's unsafe shared current-test field.
- `RetryAnalyzer` and `RetryListener` map to Playwright's native `retries` setting, with the source maximum of two retries centralized in `src/framework/utils/retry.ts`.
- TypeScript uses `NodeNext` module and resolution settings instead of the source project's Java/Maven compilation model; this removes the deprecated Node10 resolution warning while remaining compatible with the Playwright config loader.

### Phase 2 REVIEW_REQUIRED items

- **Selenium alert wait**: Playwright dialogs are event-driven. `ElementActions.waitForAlert()` returns `page.waitForEvent('dialog')`, so a future consumer must await it concurrently with the action that opens the dialog; there is no safe standalone equivalent to Selenium's polling condition.
- **Selenium staleness**: Playwright locators re-resolve elements and generally eliminate stale-element handling. The current `waitForStaleness()` maps to detached state, but any future consumer that expects Selenium's exact element-reference invalidation needs manual review.
- **Rest-Assured response timing**: Playwright `APIResponse` does not expose Rest-Assured's `getTime()` value. `assertResponseTimeLessThan` was not guessed or migrated; a future API client/test must measure request duration explicitly and then apply the threshold.
- **Full JSONPath**: the migrated assertion helper supports the source's observed dot paths such as `data.first_name`; expressions, arrays, and filters beyond that subset require review before API test migration.
- **Safari equivalence**: Selenium `SafariDriver` and Playwright WebKit are different browser engines/runtime integrations; validate against the intended CI and local browser coverage.

## Phase 3 Page Object decisions

- `web/base/BasePage` maps to `src/framework/web/base-page.ts` and retains protected title, URL, refresh, back, and forward operations. The constructor receives a Playwright `Page` and reuses `ElementActions`.
- `LoginPage` maps to `src/framework/web/pages/login-page.ts`. The username/password name selectors and submit XPath are preserved; `loginToPortal` remains an asynchronous boolean-returning operation that catches errors, logs them, and returns `false`.
- `DashboardPage` maps to `src/framework/web/pages/dashboard-page.ts`. `Menu` values and the dynamic `MENU_ITEM` XPath are preserved through the Phase 2 `xpath` helper. Menu-click errors still return `false` after logging.
- `AdminPage` maps to `src/framework/web/pages/admin-page.ts`. The role/status dynamic checkbox XPath, delete button, modal cancel button, first-match selection, scrolling, focus-class validation, and boolean error contracts are preserved.
- Source locator classes map to `src/framework/web/locators/*-locators.ts`. Selenium `By.name` selectors become CSS attribute selectors, while XPath templates remain XPath strings passed to `page.locator`.
- Source `Menu` maps to `src/framework/web/enums/menu.ts` as a class with static values and `getValue()`, preserving the source's public value-access behavior without introducing a generic enum abstraction.

### Phase 3 REVIEW_REQUIRED items

- **Admin checkbox focus class**: the source validates that the clicked span's class contains `focus`; this exact DOM/state contract must be confirmed against the live OrangeHRM page during test migration.
- **Locator equivalence**: CSS attribute selectors for the username/password fields are equivalent to Selenium `By.name` for the current markup, but live-page validation remains required.
- **Async public API**: Playwright page actions return promises, so future migrated tests must `await` the same business methods; this is required by Playwright and does not change their business result contract.

## Phase 4 UI test decisions

- `web.tests.LoginTest.verifyLogin` maps to `tests/ui/login.spec.ts` with the exact test title, `@ui-smoke` tag, `Admin`/`admin123` data, login step message, and `AssertionUtils.assertTrue` behavior.
- The source suite assigns `LoginTest` to `Chrome-QA`; the Playwright test skips non-`chrome` projects so the all-project default does not silently execute the scenario under other browsers.
- Playwright's page fixture replaces `BaseTest`'s per-method driver setup and teardown. The test explicitly navigates to the configured UI URL before constructing `LoginPage`, preserving the source `driver.get(url)` setup intent.
- The target uses Playwright tag metadata rather than TestNG groups; `@ui-smoke` remains filterable through Playwright's tag/grep mechanisms.
- `web.tests.AdminTest.verifyUserExists` maps to `tests/ui/admin.spec.ts` with the exact test title, `@ui-regression` tag, `ESS`/`Enabled` data, page-object sequence, and assertion messages preserved.
- The source suite assigns `AdminTest` to `Firefox-QA`; the Playwright test skips non-`firefox` projects for the same reason as the Login test's Chrome restriction.
- No TestNG data providers, dependencies, ordering, or additional UI scenarios exist in the source UI test classes, so no corresponding Playwright constructs were invented.

### Phase 4 REVIEW_REQUIRED items

- **Runtime UI equivalence**: targeted QA execution passed; broader browser-matrix coverage and future environment changes still require validation.
- **Hard-coded source credentials**: `Admin`/`admin123` are preserved for behavioral fidelity, but should be moved to secret-backed configuration in a later security-focused review without changing the scenario.
- **Browser assignment model**: source TestNG suite maps each test to one browser; Playwright represents this with project skips. Confirm the desired reporting shape when browser execution is introduced.

### Phase 4 runtime validation decisions

- Runtime validation initially exposed a missing local Chromium executable. Chromium and Firefox Playwright browser binaries were installed; no source or test behavior was changed for this environment prerequisite.
- Firefox QA navigation exceeded the target's initial 10-second navigation timeout. The default was raised to 30 seconds because Selenium `driver.get` had no corresponding 10-second limit.
- The live Admin flow exceeded the target's initial 30-second test timeout while completing successfully. The default was raised to 60 seconds because the Selenium suite had no per-test timeout.
- No selector, authentication, assertion, or Page Object behavior was weakened to obtain a pass.

## Phase 5 final validation decisions

- Validate the complete migrated UI suite on the source-intended Chrome and Firefox projects. Cross-project cases are discovered but skipped by explicit project guards, preserving the source TestNG browser assignment without duplicating scenarios.
- Treat the successful QA run as runtime evidence for the configured environment only; it does not establish Edge, Safari/WebKit, or future-environment equivalence.
- Keep API migration out of the final validation scope because the source API tests were not migrated.

## API migration decisions

- `api.base.BaseApiTest` is represented by the existing `apiRequest` fixture. It preserves the environment API URL, JSON content type, optional environment-backed `x-api-key`, and per-test cleanup without Rest-Assured global state.
- `api.clients.UserApiClient.getUser` maps to `ApiRequest.getUser`, preserving `GET /users/{id}`, request/response/status logging, and returning a measured response duration for the source timing assertion.
- The API fixture normalizes a configured base URL such as `https://reqres.in/api` to `https://reqres.in/api/` before resolving the relative `users/{id}` path. This is required because Playwright URL resolution otherwise drops the final `/api` segment; it was a genuine migration defect found at runtime.
- Playwright JSON parsing returns native numbers, while the source uses Rest-Assured `getString` for JSON-path equality. The shared assertion helper converts actual values to strings when the expected source value is a string, preserving the source `data.id == "2"` behavior.
- `verifyUserExists` and `verifyUserWithSoftAssertions` map to separate API spec files with the exact source names, `@api-smoke` tag, user ID `2`, validation order, messages, and soft-assertion behavior.

### API migration REVIEW_REQUIRED items

- The configured QA API key must be supplied through `QA_API_KEY`; it is intentionally not stored in the target repository. Without it, the external service currently returns an HTML 404 response and the preserved assertions fail.
- Rest-Assured request/response console formatting is represented by the target logger's text response output; exact formatting is intentionally different.
- Response-time measurements use Playwright client elapsed time (`performance.now`) rather than Rest-Assured's `getTime()` implementation; the 2000 ms threshold and assertion are preserved, but timings are not numerically identical across clients.

## General rules

- Treat Java source and suite/config files as authoritative over README claims.
- Preserve test names, groups, input values, expected values, and workflow order unless a compatibility change is documented.
- Keep UI and API execution as separate concerns while preserving their shared reporting/assertion behavior where practical.
- Do not carry over unsupported claims such as data providers, database access, file integrations, or implemented WebDriverManager usage.
- Keep the source Selenium project untouched during migration.

## Test execution and lifecycle

- Convert `testNG.xml`'s three logical `<test>` blocks into equivalent Playwright projects or tagged execution units: Chrome/QA Login, Firefox/QA Admin, and API/QA User tests.
- Preserve the suite's intended `parallel="tests"` behavior, but validate concurrency against report and API state before enabling parallel workers.
- Preserve the `browser`, `env`, and `headless` parameters and their defaults: chrome, qa, and false in base setup; the main suite explicitly uses headless true.
- Preserve the API suite's environment-only setup; do not create a browser for API tests.
- Preserve `ui-smoke`, `ui-regression`, and `api-smoke` group/tag intent.
- Preserve before-suite logging/report initialization, per-UI-test browser setup, per-UI-test browser teardown, and API class setup semantics. Add explicit API cleanup if the target runtime needs it, and record that as lifecycle hardening rather than behavioral redesign.

## Browser and page-object conversion

- Map `DriverFactory` browser selection to Playwright browser projects for Chromium, Firefox, and WebKit. Safari is represented by WebKit only if the target environment accepts that equivalence; review manually because the source uses `SafariDriver`.
- Preserve headless behavior and the Chromium no-sandbox/disable-dev-shm-usage CI intent where applicable.
- Convert `BasePage` to a page-object base that receives the target page/context and retains title, URL, refresh, back, and forward helpers.
- Convert `LoginPage`, `DashboardPage`, and `AdminPage` as action-focused page objects. Keep page methods' business meaning and existing boolean success contract until tests are deliberately redesigned.
- Preserve locator constants and dynamic XPath templates. Prefer Playwright locator objects for synchronization, but verify that each selector still targets the same DOM element.
- Preserve `Menu` values and the `DashboardPage.clickOnMenu` dynamic menu selection.
- Do not introduce PageFactory-style fields; the source deliberately uses explicit `By` locators and waits.

## Synchronization and actions

- Map the 10-second explicit waits to Playwright's locator/action auto-waiting plus an explicit 10-second timeout where the source wait is behaviorally significant.
- Preserve visibility/clickability semantics for click and text entry, and preserve the JavaScript behavior only where normal Playwright actions do not provide equivalent behavior.
- Preserve scroll-to-center behavior for Admin table selection and delete controls.
- Preserve page-load readiness intent, alert handling, staleness-related intent, element text/attribute/state reads, and multi-element lookup semantics; validate each use because Playwright has different primitives.
- Preserve the dynamic XPath formatting behavior in `LocatorUtil` and verify escaping for values containing XPath-sensitive characters.
- Keep exception-to-boolean behavior only if tests still require it. Manual review is required because Playwright failures are usually more diagnostic when allowed to throw.

## API conversion

- Preserve `qa.api.url`, `prod.api.url`, `qa.api.key`, the `x-api-key` header, JSON content type, and `GET /users/{id}` contract.
- Preserve the two API tests and their exact assertions: status 200, first name Janet, response time under 2000 ms, non-null email, ID 2, non-empty data, email domain, and non-empty last name.
- Replace Rest-Assured global `baseURI` and `requestSpecification` with worker/test-scoped request context so parallel API tests cannot overwrite one another.
- Preserve request and response logging, but do not expose API keys in logs or reports.
- Retain response JSON-path semantics and response-time assertions, with an explicit decision about whether client/network timing remains comparable after migration.

## Assertions, reporting, and logging

- Preserve hard assertion fail-fast behavior and soft assertion accumulation followed by `assertAll`.
- Preserve pass/fail step messages and test categories for browser/environment where the target reporter supports them.
- Create one report test object per test attempt/worker and ensure the current test is isolated per worker. Do not reproduce the source listener's non-thread-local `test` field.
- Preserve failure screenshots for UI failures and artifact paths derived from a run identifier.
- Preserve log output for framework operations, API requests/responses, and failures while moving credentials to CI/environment secrets.
- Reset soft assertion state after every test, including retries; this is required to avoid source thread reuse leakage.

## Retry and failure behavior

- Preserve the source retry policy of two retries after the initial attempt, for a maximum of three attempts, unless CI stability requirements change it.
- Ensure every retry has fresh browser/page/request state and does not reuse a failed soft assertion or stale report object.
- Preserve screenshot-on-UI-failure behavior, including the no-browser API failure path.
- Report retries distinctly so an eventual pass does not hide intermittent failures.

## Configuration and CI

- Preserve environment-key lookup semantics and fail clearly when a required environment value is missing; document any intentional improvement from the source's null-return behavior.
- Keep UI and API URLs configurable rather than hard-coded in target tests.
- Replace source-controlled API credentials and hard-coded UI credentials with CI/local secret configuration as a manual security review item.
- Preserve artifact categories: report, logs, and screenshots, and the `if: always()` upload behavior.
- Preserve Java 17 CI's intent as the target Node/Playwright runtime requirement in the new CI workflow, while adding browser installation and dependency caching as target-specific setup.
- Preserve `mvn ... -DsuiteXmlFile=...` as historical execution behavior only; the target command should be documented separately and must not require Maven.

## Manual review gates

- Confirm whether the two environment URLs being identical is intentional.
- Confirm the API key and UI credentials with the service owners before migration.
- Validate selector equivalence against the live OrangeHRM page.
- Decide whether boolean page actions should remain or become throwing actions.
- Validate parallel report writes and API request isolation.
- Confirm Safari/WebKit equivalence and CI browser availability.
- Confirm response-time threshold semantics in the new HTTP client.
