import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { IResponse } from "@/app/shared/types";

export enum EHttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

class HttpService {
  private http: AxiosInstance;
  private baseURL = process.env.API_BASE_URL;

  constructor() {
    this.http = axios.create({ baseURL: this.baseURL });
  }

  // Handle HTTP requests
  public async request<Res>(
    method: EHttpMethod,
    url: string,
    token: string | null,
    options?: AxiosRequestConfig,
  ): Promise<IResponse<Res>> {
    try {
      const response = await this.http.request<Res>({
        method,
        url,
        ...options,
        headers: { ["Authorization"]: `Bearer ${token}` },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (e: any) {
      const error = e?.response?.data?.error
        ? e?.response?.data?.error
        : "Unknown error";
      return {
        success: false,
        error,
        data: null,
      };
    }
  }

  public async get<Res>(
    apiPaths: string,
    token: string | null,
    params?: any,
  ): Promise<IResponse<Res>> {
    return this.request<Res>(
      EHttpMethod.GET,
      `${this.baseURL}${apiPaths}`,
      token,
      {
        params,
      },
    );
  }

  // Perform POST request
  public async post<Req, Res>(
    apiPaths: string,
    token: string | null,
    payload: Req,
    params?: any,
  ): Promise<IResponse<Res>> {
    return this.request<Res>(
      EHttpMethod.POST,
      `${this.baseURL}${apiPaths}`,
      token,
      {
        params,
        data: payload,
      },
    );
  }

  // Perform UPDATE request
  public async update<Req, Res>(
    apiPaths: string,
    token: string | null,
    payload: Req,
    params?: any,
  ): Promise<IResponse<Res>> {
    return this.request<Res>(
      EHttpMethod.PUT,
      `${this.baseURL}${apiPaths}`,
      token,
      {
        params,
        data: payload,
      },
    );
  }

  // Perform DELETE request
  public async delete<Req, Res>(
    apiPaths: string,
    token: string | null,
    payload: Req,
    params?: any,
  ): Promise<IResponse<Res>> {
    return this.request<Res>(
      EHttpMethod.DELETE,
      `${this.baseURL}${apiPaths}`,
      token,
      {
        params,
        data: payload,
      },
    );
  }
}

export { HttpService as default };
