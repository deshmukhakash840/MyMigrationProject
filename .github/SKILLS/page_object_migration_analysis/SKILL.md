
---
name: page-object-migration
description: Migrate Selenium Java Page Objects, locator classes, and reusable UI components to Playwright TypeScript while preserving structure and behavior.
---
# Page Object Migration Skill

## Objective

Convert Selenium Java Page Objects and their locator dependencies into Playwright TypeScript while preserving the source framework's responsibilities, flows, naming intent, and behavior.

## Scope

Migrate only:

- Base Page Objects when applicable
- Concrete Page Objects
- Locator constant/classes
- Enums and value classes used by Page Objects
- Reusable UI components

Do not migrate UI tests in this skill.

## Process

For each Page Object:

1. Read the complete source class.
2. Identify all dependencies.
3. Read its locator classes/constants.
4. Identify methods used by tests or other Page Objects.
5. Identify waits and synchronization.
6. Identify return values and exception handling.
7. Identify logging and assertions.
8. Implement the equivalent Playwright Page Object.
9. Type-check immediately.
10. Compare the target against the source.
11. Record important mapping decisions.

## Locator Rules

Preserve:

- Locator values
- XPath/CSS templates
- Dynamic locator parameters
- Locator naming
- Selector intent

Convert Selenium `By`/`WebElement` usage to Playwright `Locator`.

Prefer the existing target locator utility when one exists.

Do not "improve" selectors merely for style.

Only change a selector when required by Playwright syntax or a verified migration issue.

## Synchronization

Translate Selenium waits according to behavior:

- Visibility → Playwright visibility-aware locator operations
- Clickability → Playwright locator actions
- Presence → Locator resolution
- Text availability → web-first assertions or appropriate locator checks

Do not blindly reproduce Selenium's explicit waits where Playwright already provides equivalent synchronization.

If the source behavior cannot be established as equivalent, mark:

`REVIEW_REQUIRED`

## Page Object Contracts

Preserve:

- Method names where practical
- Parameters
- Return types/intent
- Action order
- Logging
- Error handling
- Boolean success/failure contracts
- Navigation behavior

Do not introduce business logic that does not exist in the source.

## Dynamic Locators

Preserve dynamic XPath/CSS behavior.

Example:

Selenium:

`String.format("//div[text()='%s']", value)`

Target:

Use the existing locator utility or an equivalent Playwright locator construction.

Do not hard-code values that were dynamic in the source.

## Validation

After each Page Object batch:

- Run TypeScript typecheck.
- Check editor diagnostics.
- Validate imports.
- Verify no test files were unintentionally created.
- Compare migrated methods with their Selenium counterparts.

Runtime validation should only be claimed when the Page Object is actually exercised by a test.

## Documentation

Update:

`migration/conversion-rules.md`

with important Selenium → Playwright Page Object mappings.

Update:

`migration/migration-status.md`

with:

- Page Objects migrated
- Locator classes migrated
- Components/value classes migrated
- Validation results
- `REVIEW_REQUIRED` items

## Completion Criteria

Every source Page Object and its locator dependency must be:

- Migrated,
- Intentionally replaced with an equivalent Playwright mechanism, or
- Explicitly marked `REVIEW_REQUIRED`.

Do not migrate UI tests automatically.

Stop after the Page Object layer is complete and wait for the next authorized phase.
