/* eslint-disable @typescript-eslint/no-explicit-any */

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

interface ApiRequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public response?: Response,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = "/api") {
    this.baseURL = baseURL.replace(/\/$/, ""); 
  }

  private buildURL(
    path: string,
    params?: Record<string, string | number | boolean>,
  ): string {
    const url = new URL(
      `${this.baseURL}/${path.replace(/^\//, "")}`,
      window.location.origin,
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private async request<T = any>(
    path: string,
    config: ApiRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { method = "GET", headers = {}, body, params } = config;

    const url = this.buildURL(path, params);
    console.log(`Making ${method} request to: ${url}`);

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (body instanceof FormData) {
      delete requestHeaders["Content-Type"];
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: "include", 
    };

    if (body && !["GET", "HEAD"].includes(method)) {
      requestConfig.body =
        body instanceof FormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestConfig);

      let data: T;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else if (contentType?.includes("text/")) {
        data = (await response.text()) as T;
      } else {
        data = (await response.blob()) as T;
      }

      if (!response.ok) {
        throw new ApiError(
          response.status,
          response.statusText,
          `Request failed: ${response.status} ${response.statusText}`,
          response,
        );
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        500,
        "Network Error",
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    }
  }

  async get<T = any>(
    path: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "GET", params });
  }

  async post<T = any>(
    path: string,
    body?: any,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "POST", body, headers });
  }

  async put<T = any>(
    path: string,
    body?: any,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "PUT", body, headers });
  }

  async patch<T = any>(
    path: string,
    body?: any,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "PATCH", body, headers });
  }

  async delete<T = any>(
    path: string,
    headers?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { method: "DELETE", headers });
  }
}

export const apiClient = new ApiClient();

export { ApiClient, ApiError };

export type { ApiResponse, ApiRequestConfig };
