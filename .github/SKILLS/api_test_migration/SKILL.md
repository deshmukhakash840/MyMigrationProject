
---
name: api-test-migration
description: Migrate Selenium Java API tests and Rest-Assured flows to Playwright TypeScript while preserving requests, authentication, assertions, test data, and response validation.
---
# API Test Migration Skill

## Objective

Convert Selenium Java/Rest-Assured API tests into Playwright TypeScript while preserving the original API behavior, validation logic, and test intent.

## Scope

Migrate:

- API test classes
- API client classes
- HTTP requests
- Headers
- Authentication
- Query/path parameters
- Request payloads
- Response validation
- JSONPath usage
- Response-time assertions
- Hard assertions
- Soft assertions
- API test tags/groups
- Environment-specific API configuration

Reuse the existing Playwright API request fixture and assertion utilities.

Do not modify UI tests unless a shared dependency genuinely requires it.

## Process

For each API test:

1. Read the complete source API test.
2. Read its API client/dependencies.
3. Trace the complete request flow.
4. Identify endpoint and HTTP method.
5. Identify headers and authentication.
6. Identify request data.
7. Identify response assertions.
8. Identify JSONPath expressions.
9. Identify response-time checks.
10. Identify soft/hard assertion behavior.
11. Implement the equivalent Playwright test.
12. Type-check immediately.
13. Validate API project discovery.
14. Execute against the intended environment when available.
15. Compare runtime behavior with the source.

## Rest-Assured → Playwright Mapping

Use Playwright-native equivalents:

- Rest-Assured request → `APIRequestContext`
- `given()` configuration → request fixture/client configuration
- Headers → Playwright request headers
- `.get()` / `.post()` / etc. → corresponding Playwright request methods
- Response body → `response.json()` / `response.text()`
- Status assertion → Playwright `expect`
- JSONPath → equivalent JSON property/path extraction
- Response-time validation → explicitly measured request duration
- Rest-Assured soft assertions → Playwright `expect.soft`

Do not perform a mechanical line-by-line translation.

## Authentication

Preserve:

- Header names
- Authentication mechanism
- Environment-specific credentials
- API keys
- Tokens

Never hard-code newly introduced secrets.

Use environment variables or the existing configuration mechanism.

If the Selenium source contains hard-coded credentials, preserve them only when required for source fidelity and record:

`REVIEW_REQUIRED`

for later secret hardening.

## Assertions

Preserve:

- Status codes
- Response fields
- Expected values
- Assertion order
- Assertion messages
- Response-time thresholds
- Hard vs soft assertion behavior

Do not weaken or remove an assertion simply because the Playwright implementation behaves differently.

If Rest-Assured and Playwright represent a value differently, preserve the source's externally observable comparison semantics.

## JSONPath

Preserve the source JSONPath intent.

For simple paths, use equivalent object/property access.

For complex paths:

- Do not silently simplify them.
- Verify the resulting value against the source behavior.
- Mark unsupported semantics as `REVIEW_REQUIRED`.

## Response Time

Measure actual request duration.

Do not fabricate timing values.

Preserve the source threshold and comparison direction.

If the timing model differs materially between Rest-Assured and Playwright, document the difference.

## API Client Design

Prefer a reusable API client when the Selenium source contains one.

Preserve:

- Method responsibilities
- Endpoint construction
- Parameters
- Headers
- Logging
- Response handling

Do not introduce unnecessary abstraction layers.

## Runtime Validation

When the environment is available:

1. Run API discovery.
2. Run each migrated API test.
3. Verify HTTP status.
4. Verify response structure.
5. Verify all assertions.
6. Verify timing checks.
7. Verify authentication.
8. Investigate failures before modifying code.

Classify failures as:

- Migration defect
- API/environment issue
- Authentication/configuration issue
- Network issue
- Browser/runtime issue

Only correct genuine migration defects.

## Validation

After migration:

- TypeScript typecheck
- Editor diagnostics
- API test discovery
- API project configuration
- Dependency validation
- Runtime execution where available

Do not claim API equivalence without runtime validation when runtime access is available.

## Documentation

Update:

`migration/conversion-rules.md`

with significant Rest-Assured → Playwright mappings.

Update:

`migration/migration-status.md`

with:

- API tests migrated
- API clients migrated
- Endpoints covered
- Authentication handling
- Assertion mapping
- Runtime results
- Migration defects
- `REVIEW_REQUIRED` items

Update:

`migration/migration-report.md`

when API migration changes the final migration scope or validation results.

## Completion Criteria

Every source API test and reusable API client must be:

- Migrated,
- Intentionally replaced with an equivalent Playwright implementation, or
- Explicitly marked `REVIEW_REQUIRED`.

Do not begin another migration phase automatically.

Stop after API migration is complete and wait for explicit authorization for further work.
