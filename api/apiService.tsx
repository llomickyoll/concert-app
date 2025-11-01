import axios, { AxiosError, AxiosResponse } from "axios";

export interface ApiResponse<T> {
  isError: boolean;
  response?: T;
  error?: AxiosError;
}

export interface RequestOptions<T> {
  method: "get" | "post" | "put" | "delete";
  url: string;
  requestData?: T;
  baseUrl?: string;
  userId?: number;
}

const Service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API,
  headers: {
    "Content-Type": "application/json",
  },
});

Service.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(error),
);

export async function apiHandler<T, U>({
  method,
  url,
  requestData,
  baseUrl,
  userId,
}: RequestOptions<T>): Promise<ApiResponse<U>> {
  try {
    const headers: Record<string, string> = {};

    if (userId != null) {
      headers["x-user-id"] = String(userId);
    }

    const resp = await Service({
      method,
      url,
      data: requestData,
      baseURL: baseUrl,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });

    return {
      isError: false,
      response: resp.data as U,
    };
  } catch (error) {
    return {
      isError: true,
      error: error as AxiosError,
    };
  }
}

export default Service;
