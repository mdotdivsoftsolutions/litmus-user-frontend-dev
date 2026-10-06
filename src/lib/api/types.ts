/** Query-string values accepted by list endpoints (undefined/null values are dropped by axios). */
export type ApiQueryParams = Record<string, string | number | boolean | null | undefined>;

/**
 * JSON request body forwarded to the API as-is. The server validates it, so callers may pass
 * any serialisable object; `unknown` keeps type-safety without `any`.
 */
export type ApiRequestBody = unknown;
