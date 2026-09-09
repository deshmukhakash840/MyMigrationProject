
# Traceability Skill

## Purpose

Maintain a clear source-to-target record for the Selenium → Playwright migration.

## Traceability Requirements

For every migration phase, record:

- Source files analyzed
- Target files created or modified
- Source behavior preserved
- Playwright-native replacements
- Missing or unsupported behavior
- Concrete corrections made
- Validation performed
- Remaining `REVIEW_REQUIRED` items

## Classification

Every significant source behavior should be classified as one of:

### Equivalent

The Playwright implementation preserves the source behavior sufficiently.

### Intentional Playwright-Native Replacement

The implementation differs structurally because Playwright provides a different native mechanism, while preserving the intended behavior.

### Corrected

A concrete migration mismatch was discovered and fixed.

### REVIEW_REQUIRED

The source behavior cannot be confidently reproduced or validated yet.

Examples:

- SafariDriver vs Playwright WebKit behavior
- Selenium alert semantics
- stale-element behavior
- Rest-Assured-specific response timing
- unsupported or partially mapped JSONPath behavior
- application-specific DOM behavior

## Documentation Files

Maintain:

- `migration/conversion-rules.md`
- `migration/migration-status.md`
- `migration/migration-report.md` when a final report is required

## Rules

- Do not invent missing source behavior.
- Do not silently discard source functionality.
- Do not mark behavior as equivalent without evidence.
- Record concrete corrections separately from intentional replacements.
- Keep documentation aligned with the actual repository state.
- Update traceability immediately after completing a migration phase.
- Preserve historical phase information rather than overwriting it.

## Source Protection

The Selenium source is read-only.

Never:

- modify Selenium files
- rename Selenium files
- delete Selenium files
- rewrite Selenium implementations

Traceability must describe the source accurately without changing it.

## Completion Criteria

A phase is traceable only when:

1. All relevant source components have been accounted for.
2. Every target component has a documented source relationship.
3. Missing behavior is explicitly recorded.
4. `REVIEW_REQUIRED` items are documented.
5. Corrections are recorded with their reason.
6. Validation results are recorded.
7. No unrelated migration work has been started.
