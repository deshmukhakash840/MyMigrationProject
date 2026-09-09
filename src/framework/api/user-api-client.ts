import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface ApiUserResult {
  response: APIResponse;
  elapsedMs: number;
}

export class UserApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
    private readonly apiKey?: string,
  ) {}

  public async getUser(id: number): Promise<ApiUserResult> {
    const startedAt = Date.now();
    const url = `${this.baseUrl.replace(/\/$/, '')}/users/${id}`;
    const response = await this.request.get(url, {
      headers: {
        'x-api-key': this.apiKey ?? '',
      },
    });

    return {
      response,
      elapsedMs: Date.now() - startedAt,
    };
  }
}
