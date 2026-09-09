import { test, expect } from '@playwright/test';
import { UserApiClient } from '../../src/framework/api/user-api-client.js';
import { assertStatusCode, assertJsonPathEquals, assertResponseTimeLessThan, assertJsonPathNotNull, softAssertTrue, softAssertEquals, softAssertNotEquals, assertAll } from '../../src/framework/utils/assertions.js';

test.describe('User API', () => {
  test('verifyUserExists @api-smoke', async ({ request }) => {
    const api = new UserApiClient(request, 'https://reqres.in/api', process.env.API_KEY);
    const { response, elapsedMs } = await api.getUser(2);

    await assertStatusCode(response, 200, 'Verified status code is 200');
    await assertJsonPathEquals(response, 'data.first_name', 'Janet', 'Verified first name is Janet');
    await assertResponseTimeLessThan(elapsedMs, 2000, 'Verified response time is less than 2 seconds');
    await assertJsonPathNotNull(response, 'data.email', 'Verified email is present');
  });

  test('verifyUserWithSoftAssertions @api-smoke', async ({ request }) => {
    const api = new UserApiClient(request, 'https://reqres.in/api', process.env.API_KEY);
    const { response } = await api.getUser(2);

    await softAssertTrue(response.status() === 200, 'Verify status code is 200');
    await softAssertEquals((await response.json()).data.id.toString(), '2', 'Verify page number is 2');
    await softAssertTrue(Boolean((await response.json()).data), 'Verify users list is not empty');

    const payload = await response.json();
    const firstUserFirstName = String(payload.data.first_name);
    const firstUserEmail = String(payload.data.email);

    await softAssertEquals(firstUserFirstName, 'Janet', "Verify first user's first name");
    await softAssertTrue(firstUserEmail.includes('@reqres.in'), 'Verify email domain is correct');

    const secondUserLastName = String(payload.data.last_name);
    await softAssertNotEquals(secondUserLastName, '', `Verify second user's last name is not empty. It's ${secondUserLastName}`);

    assertAll();
  });
});
