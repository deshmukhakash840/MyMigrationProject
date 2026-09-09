import { expect, type APIResponse } from '@playwright/test';

export async function getJsonValue<T = unknown>(response: APIResponse, jsonPath: string): Promise<T> {
  const json = await response.json();
  if (!jsonPath || jsonPath === '$') {
    return json as T;
  }

  const segments = jsonPath
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);

  let current: any = json;
  for (const segment of segments) {
    if (current == null) {
      return undefined as T;
    }
    current = current[segment];
  }

  return current as T;
}

export async function assertTrue(condition: boolean, message: string): Promise<void> {
  expect(condition, message).toBeTruthy();
}

export async function assertEquals(actual: unknown, expected: unknown, message: string): Promise<void> {
  expect(actual, message).toBe(expected);
}

export async function assertStatusCode(response: APIResponse, expectedStatusCode: number, message: string): Promise<void> {
  expect(response.status(), message).toBe(expectedStatusCode);
}

export async function assertJsonPathEquals(response: APIResponse, jsonPath: string, expectedValue: string, message: string): Promise<void> {
  const actual = await getJsonValue(response, jsonPath);
  expect(String(actual), message).toBe(String(expectedValue));
}

export async function assertResponseTimeLessThan(actualMs: number, expectedTimeInMillis: number, message: string): Promise<void> {
  expect(actualMs, message).toBeLessThan(expectedTimeInMillis);
}

export async function assertJsonPathNotNull(response: APIResponse, jsonPath: string, message: string): Promise<void> {
  const actual = await getJsonValue(response, jsonPath);
  expect(actual, message).not.toBeNull();
}

export async function softAssertTrue(condition: boolean, message: string): Promise<void> {
  expect.soft(condition, message).toBeTruthy();
}

export async function softAssertEquals(actual: unknown, expected: unknown, message: string): Promise<void> {
  expect.soft(actual, message).toBe(expected);
}

export async function softAssertNotEquals(actual: unknown, expected: unknown, message: string): Promise<void> {
  expect.soft(actual, message).not.toBe(expected);
}

export function assertAll(): void {
  // Playwright soft assertions are reported as part of the active test.
  // Keeping this as a no-op preserves the source contract without using an unsupported API.
}
