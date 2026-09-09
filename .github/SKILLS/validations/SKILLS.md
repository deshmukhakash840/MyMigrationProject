
# Validation Skill

## Purpose

Validate the Selenium → Playwright migration after each migration phase without introducing unrelated changes.

## Validation Principles

- Validate only the scope completed in the current phase.
- Never modify `selenium-framework`.
- Do not start the next migration phase automatically.
- Install required dependencies and browser runtime prerequisites automatically when the migration target needs them to execute or compile.
- Do not run Playwright tests or browser-based validation unless the user has explicitly approved runtime validation.
- Do not claim runtime equivalence unless the migrated tests were actually executed with approval.
- Treat `Playwright "no tests found"` as expected when the current phase intentionally contains no tests.
- Distinguish migration defects from environment or application failures.
- Before concluding the migration is equivalent, confirm whether the Java source implements environment-wise or region-wise configuration logic and whether the target preserves it.

## Required Checks

Run the checks applicable to the current phase:

1. TypeScript compilation
2. Editor diagnostics
3. Playwright configuration loading
4. Playwright test discovery
5. Dependency validation
6. Runtime execution when migrated tests exist
7. Scope/inventory validation

## Runtime Validation

When tests exist:

- Execute them on their intended Playwright projects.
- Preserve source browser assignments.
- Capture actual pass/fail results.
- Diagnose failures before making changes.
- Fix only genuine migration defects.
- Rerun affected tests after a correction.

Do not change assertions, selectors, workflows, or business behavior merely to make a test pass.

## Failure Classification

Classify failures as:

- **Migration defect** — target implementation differs incorrectly from the source.
- **Environment issue** — missing browser, dependency, credential, configuration, or runtime prerequisite.
- **Application/API issue** — target application or external service behaves differently.
- **REVIEW_REQUIRED** — behavior cannot be confidently mapped and requires manual verification.

## Final Validation

Before completing a phase:

- Confirm modified files are within phase scope.
- Confirm `selenium-framework` remains untouched.
- Confirm no unintended tests or business logic were added.
- Remove generated validation artifacts when appropriate.
- Update `migration-status.md`.
- Update `conversion-rules.md` when a mapping or behavioral difference was discovered.
- Never start another phase automatically.
