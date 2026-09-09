
---
name: ui-test-migration
description: Migrate Selenium Java and TestNG UI tests to Playwright TypeScript while preserving test flow, assertions, data, tags, and browser assignments.
---
# UI Test Migration Skill

## Objective

Convert Selenium Java/TestNG UI tests into Playwright TypeScript tests while preserving the original test behavior and execution intent.

## Scope

Migrate only:

- UI test classes
- Test methods
- TestNG groups/tags
- Test data used by UI tests
- Browser assignments
- Environment assignments
- Assertions
- Test execution flow

Reuse the existing migrated Page Objects and framework utilities.

Do not create new Page Objects or framework utilities unless a genuine missing dependency is discovered.

## Process

For each source UI test:

1. Read the complete test class.
2. Read its Page Object dependencies.
3. Trace the complete test flow.
4. Identify test data and configuration dependencies.
5. Identify TestNG annotations/groups.
6. Identify browser/environment assignments.
7. Identify setup and teardown behavior.
8. Identify every assertion and its message.
9. Create the equivalent Playwright test.
10. Type-check immediately.
11. Validate test discovery.
12. Compare the target flow against the source.

## Preserve

Maintain:

- Test names
- Test descriptions where applicable
- Test data
- Credentials/configuration references
- Page Object sequence
- Navigation flow
- Action order
- Assertions
- Assertion messages
- Tags/groups
- Browser assignments
- Environment selection
- Retry intent

Do not simplify or redesign the test flow.

## TestNG → Playwright

Map TestNG concepts to Playwright equivalents:

- `@Test` → `test()`
- Groups → Playwright tags
- `@BeforeMethod` → fixtures/hooks as appropriate
- `@AfterMethod` → fixtures/hooks as appropriate
- TestNG retries → Playwright retry configuration

Use the existing target fixture architecture.

## Browser Assignment

If the Selenium suite assigns a test to a specific browser:

- Preserve that assignment.
- Use Playwright project selection or equivalent test-level logic.
- Do not execute the test against unrelated browsers merely because those projects exist.

## Assertions

Preserve:

- Assertion type
- Expected value
- Actual value
- Assertion order
- Assertion message

Use Playwright web-first assertions where they provide equivalent synchronization.

Do not weaken assertions to make a migrated test pass.

## Runtime Validation

When the environment is available:

1. Run the test on its intended Playwright project.
2. Capture failures.
3. Determine whether the failure is:
   - Migration defect
   - Application/environment issue
   - Missing prerequisite
   - Browser/runtime issue
4. Fix only genuine migration defects.
5. Rerun the affected test.

Do not modify test logic solely to hide an environmental failure.

## Validation

After migration:

- TypeScript typecheck
- Editor diagnostics
- Test discovery
- Project/tag discovery
- Intended browser project validation
- Runtime execution when environment access is available

Do not claim runtime equivalence without execution.

## Documentation

Update:

`migration/conversion-rules.md`

with important test migration mappings.

Update:

`migration/migration-status.md`

with:

- Tests migrated
- Source browser/environment assignments
- Validation results
- Runtime results
- Migration defects found
- `REVIEW_REQUIRED` items

## Completion Criteria

Every source UI test must be:

- Migrated,
- Intentionally excluded with documented justification, or
- Marked `REVIEW_REQUIRED`.

Do not begin API migration automatically.

Stop after UI test migration is complete and wait for the next authorized phase.
