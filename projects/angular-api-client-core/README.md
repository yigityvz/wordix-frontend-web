# Angular API Client Core

`angular-api-client-core` is a small, backend-agnostic Angular library for building typed feature API services without repeating `HttpClient`, base URL handling, or request setup in every service.

The library provides a reusable `BaseApiService` with protected `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` methods. Your application extends that base class and exposes only the domain operations it actually supports.

It does **not** impose a backend response envelope, authentication provider, state-management library, or business-domain model. Those concerns remain in the consuming application.

## Table of contents

- [Why use this library?](#why-use-this-library)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick start](#quick-start)
- [HTTP method examples](#http-method-examples)
- [Request options](#request-options)
- [Authentication](#authentication)
- [Backend response envelopes](#backend-response-envelopes)
- [Error handling](#error-handling)
- [Testing a feature API service](#testing-a-feature-api-service)
- [URL and security rules](#url-and-security-rules)
- [Architecture guidance](#architecture-guidance)
- [Troubleshooting](#troubleshooting)
- [Building and packaging from source](#building-and-packaging-from-source)
- [Public API](#public-api)
- [License](#license)

## Why use this library?

Without a shared base class, Angular feature services often repeat the same infrastructure:

```ts
this.http.get(`${environment.apiBaseUrl}/users`);
this.http.post(`${environment.apiBaseUrl}/users`, request);
```

That repetition creates several problems:

- Base URL normalization is implemented more than once.
- Feature services become coupled to environment-file layouts.
- Request options and generic response types are inconsistent.
- Backend envelope mapping gets copied into every endpoint method.
- Refactoring authentication, error handling, or request behavior becomes harder.

With this library, a feature service contains only its endpoint paths and DTO contracts:

```ts
@Injectable({ providedIn: 'root' })
export class UsersApiService extends BaseApiService {
  getUsers(): Observable<readonly UserDto[]> {
    return this.get<readonly UserDto[]>('users');
  }
}
```

### What the library provides

- A centrally configured API base URL.
- Safe joining of the base URL and relative endpoint paths.
- Typed JSON `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` methods.
- Support for headers, query parameters, `HttpContext`, timeouts, credentials, and transfer cache options.
- Optional request bodies for APIs that require a `DELETE` body.
- Full compatibility with Angular HTTP interceptors.
- A narrow public API that can be moved between applications.

### What the library deliberately does not provide

- Login, logout, token storage, or token refresh.
- A dependency on Keycloak, Auth0, Firebase, or another identity provider.
- A required backend response format such as `{ data, success }`.
- Global toast, router, form, NgRx, or business-domain behavior.
- Automatic retry rules that could repeat non-idempotent requests.
- File upload/download event abstractions.

Keeping these concerns outside the package is what makes it reusable.

## Requirements

The current package build targets:

- Angular `^21.2.0`
- `@angular/common` and `@angular/core` from the same Angular release line
- RxJS `^7.8.0`
- `tslib ^2.3.0`
- An application configured with Angular `HttpClient`

The package uses Angular partial compilation and is intended for Angular applications. It is not a framework-independent Fetch or Axios client.

## Installation

### From npm

After the package is published:

```bash
npm install angular-api-client-core
```

Do not install a second Angular version specifically for this package. The package declares Angular as a peer dependency and must use the consuming application's Angular runtime.

### From a local package tarball

This is useful before the first public npm release:

```bash
npm run build:api-core
cd dist/angular-api-client-core
npm pack
```

Install the generated `.tgz` file in another Angular project:

```bash
npm install /absolute/path/to/angular-api-client-core-0.0.1.tgz
```

### From the same Angular workspace

Build the library before starting or building the application:

```bash
npm run build:api-core
```

The consuming application can then import from the package name:

```ts
import { BaseApiService, provideApiClient } from 'angular-api-client-core';
```

Avoid importing internal paths such as `angular-api-client-core/src/lib/...`. Only imports from the package root are part of the supported public API.

## Quick start

### 1. Register Angular HttpClient and the API base URL

For a standalone Angular application, add both providers to `app.config.ts`:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideApiClient } from 'angular-api-client-core';

import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    provideApiClient({
      baseUrl: 'https://api.example.com/v1',
    }),
  ],
};
```

If authentication is not required, use `provideHttpClient()` without `withInterceptors(...)`.

The base URL:

- must not be empty;
- may contain a path such as `/api/v1`;
- may contain trailing slashes, which are removed during setup;
- is stored as an immutable configuration object.

### 2. Define request and response DTOs

```ts
export interface UserDto {
  readonly id: string;
  readonly displayName: string;
  readonly active: boolean;
}

export interface CreateUserRequest {
  readonly displayName: string;
}

export interface UpdateUserRequest {
  readonly displayName: string;
  readonly active: boolean;
}
```

Keep these DTOs in the consuming feature. The library does not need to know your business models.

### 3. Extend BaseApiService

```ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'angular-api-client-core';

import { CreateUserRequest, UpdateUserRequest, UserDto } from './user.models';

@Injectable({ providedIn: 'root' })
export class UsersApiService extends BaseApiService {
  getUsers(): Observable<readonly UserDto[]> {
    return this.get<readonly UserDto[]>('users');
  }

  getUser(userId: string): Observable<UserDto> {
    const encodedUserId = encodeURIComponent(userId);
    return this.get<UserDto>(`users/${encodedUserId}`);
  }

  createUser(request: CreateUserRequest): Observable<UserDto> {
    return this.post<CreateUserRequest, UserDto>('users', request);
  }

  updateUser(userId: string, request: UpdateUserRequest): Observable<UserDto> {
    const encodedUserId = encodeURIComponent(userId);
    return this.put<UpdateUserRequest, UserDto>(`users/${encodedUserId}`, request);
  }

  deleteUser(userId: string): Observable<void> {
    const encodedUserId = encodeURIComponent(userId);
    return this.delete<void>(`users/${encodedUserId}`);
  }
}
```

The inherited HTTP methods are `protected`. Components cannot inject `BaseApiService` and issue arbitrary requests. They use explicit methods such as `getUsers()` or `createUser()` from your feature service.

### 4. Consume the feature service

```ts
import { Component, inject } from '@angular/core';
import { UsersApiService } from './users-api.service';

@Component({
  selector: 'app-users-page',
  template: `<!-- Render loading, error, empty, and success states here. -->`,
})
export class UsersPage {
  private readonly usersApi = inject(UsersApiService);

  loadUsers(): void {
    this.usersApi.getUsers().subscribe({
      next: (users) => console.log(users),
      error: (error) => console.error(error),
    });
  }
}
```

For larger applications, call the feature API service from a facade, store effect, or other application layer instead of directly from a component.

## HTTP method examples

All methods return `Observable<TResponse>` and expect JSON responses.

### GET

```ts
getUsers(page: number): Observable<readonly UserDto[]> {
  return this.get<readonly UserDto[]>('users', {
    params: { page, active: true },
  });
}
```

### POST

The first generic type is the request body; the second is the response body:

```ts
createUser(request: CreateUserRequest): Observable<UserDto> {
  return this.post<CreateUserRequest, UserDto>('users', request);
}
```

### PUT

```ts
replaceUser(userId: string, request: UpdateUserRequest): Observable<UserDto> {
  return this.put<UpdateUserRequest, UserDto>(
    `users/${encodeURIComponent(userId)}`,
    request,
  );
}
```

### PATCH

```ts
setUserStatus(userId: string, active: boolean): Observable<UserDto> {
  return this.patch<{ readonly active: boolean }, UserDto>(
    `users/${encodeURIComponent(userId)}`,
    { active },
  );
}
```

### DELETE

```ts
deleteUser(userId: string): Observable<void> {
  return this.delete<void>(`users/${encodeURIComponent(userId)}`);
}
```

If a backend explicitly requires a DELETE body:

```ts
deleteUser(userId: string, reason: string): Observable<DeleteResultDto> {
  return this.delete<DeleteResultDto>(`users/${encodeURIComponent(userId)}`, {
    body: { reason },
  });
}
```

Only send a DELETE body when the backend contract requires it. Some servers and intermediaries do not support DELETE bodies consistently.

## Request options

Every HTTP method accepts an optional request-options object. `DELETE` additionally accepts `body`.

| Option            | Type                                     | Purpose                                                |
| ----------------- | ---------------------------------------- | ------------------------------------------------------ |
| `headers`         | `HttpHeaders` or a string record         | Request-specific headers                               |
| `context`         | `HttpContext`                            | Metadata shared with Angular interceptors              |
| `params`          | `HttpParams` or a primitive-value record | URL query parameters                                   |
| `reportProgress`  | `boolean`                                | Enables Angular request progress preparation           |
| `withCredentials` | `boolean`                                | Sends credentials for compatible cross-origin requests |
| `credentials`     | `RequestCredentials`                     | Fetch-backend credential policy                        |
| `transferCache`   | `boolean` or include-header config       | Angular SSR transfer-cache behavior                    |
| `timeout`         | `number`                                 | Angular request timeout in milliseconds                |

### Query parameters with a plain object

```ts
return this.get<readonly UserDto[]>('users', {
  params: {
    page: 2,
    pageSize: 25,
    active: true,
    role: ['admin', 'editor'],
  },
});
```

Supported plain-object query values are `string`, `number`, `boolean`, or arrays of those primitive values.

Do not put `undefined`, `null`, objects, or dates directly in the parameter record. Convert dates to the format required by your backend and omit optional values explicitly.

### Query parameters with HttpParams

```ts
import { HttpParams } from '@angular/common/http';

let params = new HttpParams();
params = params.set('FromUtc', fromDate.toISOString());
params = params.set('PageNumber', pageNumber);

return this.get<SearchResultDto>('search', { params });
```

Remember that `HttpParams` is immutable. Assign the result of every `set`, `append`, or `delete` call.

### Request-specific headers

```ts
return this.get<UserDto>('users/current', {
  headers: {
    'X-Correlation-Id': correlationId,
  },
});
```

Use an interceptor for headers required by most requests. Use request options for headers specific to one operation.

## Authentication

This library does not read, store, create, or refresh access tokens. Authentication belongs to the consuming application and should normally be implemented with an Angular HTTP interceptor.

```ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { SessionService } from './session.service';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const accessToken = inject(SessionService).getAccessToken();

  if (!accessToken) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  );
};
```

Register the interceptor when providing Angular HttpClient:

```ts
provideHttpClient(withInterceptors([authTokenInterceptor]));
```

Because `BaseApiService` uses Angular's injected `HttpClient`, all registered interceptors continue to run normally.

## Backend response envelopes

Many APIs return an envelope instead of the domain payload directly:

```ts
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string | null;
}
```

Do not add your application-specific envelope to the general library. Create an application adapter once and let feature services extend it:

```ts
import { Observable, map } from 'rxjs';
import { ApiRequestOptions, BaseApiService } from 'angular-api-client-core';

export abstract class ApplicationApiService extends BaseApiService {
  protected getData<TResponse>(
    path: string,
    options: ApiRequestOptions = {},
  ): Observable<TResponse> {
    return this.get<ApiResponse<TResponse>>(path, options).pipe(map((response) => response.data));
  }

  protected postData<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: ApiRequestOptions = {},
  ): Observable<TResponse> {
    return this.post<TRequest, ApiResponse<TResponse>>(path, body, options).pipe(
      map((response) => response.data),
    );
  }
}
```

Feature services then use the application-specific adapter:

```ts
@Injectable({ providedIn: 'root' })
export class UsersApiService extends ApplicationApiService {
  getUsers(): Observable<readonly UserDto[]> {
    return this.getData<readonly UserDto[]>('users');
  }
}
```

This keeps the reusable package backend-agnostic while removing envelope mapping duplication from the application.

## Error handling

HTTP errors remain standard Angular `HttpErrorResponse` values. Handle cross-cutting rules in an interceptor:

```ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Map or report the error according to your application's policy.
      return throwError(() => error);
    }),
  );
```

Recommended responsibility split:

- Interceptor: authentication failures, common error normalization, correlation, and logging.
- Feature service: endpoint path and request/response DTO types.
- Facade/effect: user intent, loading state, success/failure state, navigation, and notifications.
- Component: rendering and user interaction.

The library does not retry requests automatically. Retrying `POST`, `PATCH`, or `DELETE` without an idempotency strategy can duplicate mutations.

## Testing a feature API service

Use Angular's HTTP testing providers together with `provideApiClient`:

```ts
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

describe('UsersApiService', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideApiClient({ baseUrl: 'https://api.example.test/v1/' }),
        UsersApiService,
      ],
    });

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads users with a normalized URL', async () => {
    const result = firstValueFrom(TestBed.inject(UsersApiService).getUsers());
    const request = http.expectOne('https://api.example.test/v1/users');

    expect(request.request.method).toBe('GET');
    request.flush([{ id: '1', displayName: 'Ada', active: true }]);

    await expect(result).resolves.toEqual([{ id: '1', displayName: 'Ada', active: true }]);
  });
});
```

Always register `provideHttpClient()` before `provideHttpClientTesting()` so the testing backend can replace the real backend correctly.

Useful assertions include:

- exact URL after base/path normalization;
- HTTP method;
- query parameter names and values;
- request headers;
- request body;
- response type/envelope mapping;
- absence of ownership or user identifiers that the backend derives from authentication.

## URL and security rules

Endpoint paths passed to inherited HTTP methods must be relative to the configured base URL.

Accepted examples:

```text
users
/users
users/42/notes
```

Rejected examples:

```text
https://other.example.com/users
//other.example.com/users
../admin
users\42
```

These checks help prevent a feature service from accidentally bypassing the configured API boundary.

Important limitations:

- The library does not validate business-level route identifiers.
- Always call `encodeURIComponent` on dynamic route segments.
- Do not concatenate untrusted text into a path without encoding it.
- Do not place access tokens, passwords, or API keys in query parameters.
- Base URL validation ensures a non-empty value; the consuming application remains responsible for supplying the correct trusted origin.

## Architecture guidance

A scalable consuming application can use this dependency direction:

```text
Component/Page
      ↓
Facade or Store Effect
      ↓
Feature API Service
      ↓
Application API Adapter (optional response-envelope mapping)
      ↓
BaseApiService
      ↓
Angular HttpClient + Interceptors
```

Recommended rules:

- Create one feature API service per business capability instead of one giant API service.
- Keep `BaseApiService` methods protected.
- Keep DTOs close to the feature that owns them.
- Put authentication and global error behavior in interceptors.
- Put backend-envelope mapping in a consuming-application adapter.
- Do not add application imports to the reusable package.
- Verify endpoint names and DTOs against the backend's OpenAPI contract.

## Troubleshooting

### `NullInjectorError: No provider for HttpClient`

Register Angular HttpClient during application bootstrap:

```ts
provideHttpClient();
```

### `NullInjectorError` for `API_CLIENT_CONFIG`

Register the library configuration:

```ts
provideApiClient({ baseUrl: 'https://api.example.com/v1' });
```

### `API client baseUrl değeri boş olamaz.`

The configured base URL is empty or contains only whitespace. Ensure the environment value exists before calling `provideApiClient`.

### `BaseApiService yalnızca relative endpoint path kabul eder.`

An inherited method received an absolute or protocol-relative URL. Configure the origin once in `provideApiClient` and pass only a relative endpoint path to the feature service method.

### `Endpoint path base URL sınırının dışına çıkamaz.`

The endpoint contains a parent traversal segment (`..`) or a backslash. Use a normal forward-slash relative endpoint path.

### Authorization header is missing

The library does not create tokens. Confirm that:

1. an authentication interceptor is registered with `provideHttpClient`;
2. the interceptor has access to a valid token;
3. the interceptor does not exclude the target API URL;
4. the request is sent through Angular `HttpClient` rather than another client.

### The API returns an envelope instead of the expected DTO

The generic type describes the real HTTP response body. If the backend returns `ApiResponse<UserDto>`, request that type and map it in an application adapter as shown in [Backend response envelopes](#backend-response-envelopes).

### Query parameters include unwanted values

Remove `undefined`, `null`, and empty values before creating the options object. The library forwards supported query values; it does not apply business-specific filtering rules.

### Multiple API base URLs are required

The current public provider represents one API base URL per Angular injector. Do not switch a global base URL at request time. Use an explicit application-level client boundary or a child injector configuration for a second backend, and keep each feature service tied to the intended API.

## Building and packaging from source

From the current repository workspace root:

```bash
npm install
npm run test:api-core -- --watch=false
npm run build:api-core
```

The distributable Angular package is generated at:

```text
dist/angular-api-client-core
```

Inspect the package before publishing:

```bash
cd dist/angular-api-client-core
npm pack --dry-run
```

Create a local tarball for installation testing:

```bash
npm pack
```

Publish only from the built `dist/angular-api-client-core` directory, not from the TypeScript source directory:

```bash
cd dist/angular-api-client-core
npm publish --access public
```

Before a public release:

1. choose and verify the final package name;
2. update the semantic version;
3. confirm Angular peer dependency compatibility;
4. run all tests and the production package build;
5. inspect `npm pack --dry-run` output;
6. install the tarball in a clean Angular application;
7. add the real GitHub `repository`, `homepage`, and `bugs` URLs to `package.json`;
8. publish with an npm account that owns the chosen package name.

## Public API

Import these symbols from `angular-api-client-core`:

| Symbol                    | Purpose                                           |
| ------------------------- | ------------------------------------------------- |
| `BaseApiService`          | Abstract base class with protected HTTP methods   |
| `provideApiClient`        | Registers and normalizes the API base URL         |
| `ApiClientConfig`         | Configuration contract containing `baseUrl`       |
| `API_CLIENT_CONFIG`       | Advanced access to the normalized injection token |
| `ApiRequestOptions`       | Shared JSON request options                       |
| `ApiDeleteRequestOptions` | Request options with optional DELETE body         |
| `ApiQueryParams`          | `HttpParams` or a primitive query-value record    |
| `ApiQueryValue`           | Supported query primitive type                    |

### Protected method signatures

```ts
get<TResponse>(path, options?): Observable<TResponse>
post<TRequest, TResponse>(path, body, options?): Observable<TResponse>
put<TRequest, TResponse>(path, body, options?): Observable<TResponse>
patch<TRequest, TResponse>(path, body, options?): Observable<TResponse>
delete<TResponse>(path, options?): Observable<TResponse>
```

## License

MIT. See [`LICENSE`](./LICENSE).
