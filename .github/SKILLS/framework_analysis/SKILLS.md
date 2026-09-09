
---
name: framework-migration
description: Migrate Selenium Java framework infrastructure and reusable utilities to Playwright TypeScript while preserving behavior and architecture intent.
---
# Framework Migration Skill

## Objective

Convert reusable Selenium Java framework components into Playwright TypeScript without changing business behavior or introducing unnecessary redesign.

## Scope

Migrate only:

- Configuration
- Execution/context infrastructure
- Test fixtures
- Base page
- Browser lifecycle
- API request infrastructure
- Actions
- Locators
- Assertions
- Soft assertions
- Logging
- Screenshots
- Reporting
- Retry mechanisms
- Other reusable framework utilities

Do not migrate Page Objects or tests in this skill.

## Rules

- Read the corresponding Selenium implementation before creating the target implementation.
- Preserve responsibilities and behavior.
- Prefer Playwright-native mechanisms where they provide equivalent behavior.
- Do not blindly translate Selenium APIs line-by-line.
- Preserve naming and intent unless TypeScript/Playwright requires a change.
- Keep UI and API concerns separated.
- Avoid unnecessary dependencies.
- Do not modify the Selenium source.
- Do not introduce new business logic.

## Selenium → Playwright Mapping

Use native Playwright equivalents where appropriate:

- WebDriver → Browser/BrowserContext/Page
- ThreadLocal state → Playwright fixtures
- WebElement → Locator
- By → Locator selectors
- Explicit waits → Locator auto-waiting/web-first assertions
- TestNG lifecycle → Playwright fixtures/hooks
- TestNG retry → Playwright retries
- ExtentReports → Playwright reporting/artifacts
- Rest-Assured context → APIRequestContext
- Selenium screenshots → Playwright screenshots

Mappings must preserve behavior, not merely API names.

## Behavioral Fidelity

For every migrated component verify:

- Inputs
- Outputs
- Exceptions
- Return values
- Logging
- Synchronization
- Configuration
- Browser behavior
- Request behavior
- Reporting/artifacts
- Retry behavior

If exact equivalence cannot be established, mark it:

`REVIEW_REQUIRED`

Do not silently approximate important behavior.

## Implementation Process

For each component:

1. Read source implementation.
2. Identify dependencies.
3. Identify externally observable behavior.
4. Determine Playwright-native equivalent.
5. Implement the target component.
6. Type-check immediately.
7. Compare implementation with source.
8. Record important mapping decisions.
9. Update migration documentation.

Work in small coherent batches.

## Validation

After each batch run appropriate validation:

- TypeScript typecheck
- Editor diagnostics
- Dependency validation
- Import/reference validation
- Playwright configuration validation where applicable

Do not claim runtime equivalence unless the component has actually been executed.

## Documentation

Update:

`migration/conversion-rules.md`

with significant mapping decisions.

Update:

`migration/migration-status.md`

with:

- Components migrated
- Validation performed
- Behavioral differences
- `REVIEW_REQUIRED` items

## Completion

Framework migration is complete only when every reusable framework component identified during analysis is either:

- Migrated,
- Intentionally replaced with a Playwright-native mechanism, or
- Explicitly marked `REVIEW_REQUIRED`.

Do not begin Page Object or test migration automatically.
