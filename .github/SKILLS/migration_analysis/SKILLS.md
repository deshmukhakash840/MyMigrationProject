
---
name: migration-analysis
description: Analyze a Selenium Java automation framework before migration to Playwright TypeScript.
---
# Migration Analysis Skill

## Objective

Analyze the existing Selenium Java framework and build a reliable understanding of its architecture, behavior, dependencies, and conventions before any migration begins.

## Mandatory Analysis

Inspect the source framework and identify:

- Project structure
- Framework architecture
- Build/dependency management
- Configuration and environments
- Browser and driver management
- Test lifecycle
- Execution/threading model
- Page Object Model
- Locator strategy
- Synchronization/wait strategy
- Actions and utilities
- Assertions
- Soft assertions
- Logging
- Reporting
- Screenshots/artifacts
- Retry mechanisms
- Test data
- UI tests
- API clients
- API tests
- Test suites and tags/groups
- Browser assignments
- Authentication
- External integrations
- Coding conventions

## Analysis Rules

- Do not modify the Selenium source.
- Do not start migration during analysis.
- Do not assume architecture from filenames alone.
- Trace dependencies between classes and components.
- Identify shared components before individual tests.
- Preserve the source framework's terminology and intent.
- Flag ambiguous or unverified behavior as `REVIEW_REQUIRED`.

## Source Inventory

Create a source-to-target inventory containing:

| Source | Type | Responsibility | Dependencies | Target |
| ------ | ---- | -------------- | ------------ | ------ |

Every relevant source component should eventually be accounted for.

## Behavioral Analysis

For important components determine:

- Inputs
- Outputs
- Side effects
- Error handling
- Synchronization
- Configuration dependencies
- Runtime dependencies
- Browser/environment dependencies

Pay particular attention to behavior that cannot be directly translated between Selenium and Playwright.

## Migration Documentation

After analysis, update:

`migration/conversion-rules.md`

with important Selenium → Playwright mapping decisions.

Update:

`migration/migration-status.md`

with:

- Analysis completed
- Source inventory
- Important findings
- Dependencies
- `REVIEW_REQUIRED` items
- Recommended migration order

## Migration Order

Recommend migration in dependency order:

1. Configuration
2. Execution/context infrastructure
3. Shared framework utilities
4. Page Objects/components
5. UI tests
6. API infrastructure
7. API tests
8. Final validation

Do not automatically execute the next phase.

## Completion Criteria

Analysis is complete only when:

- The source structure is understood.
- Major dependencies are mapped.
- UI and API surfaces are identified.
- Browser/environment behavior is understood.
- Shared framework components are identified.
- Test flows are understood.
- Migration risks are documented.
- No migration code has been created.

Then stop and wait for the next authorized migration phase.
