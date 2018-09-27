import Axios, { AxiosResponse, AxiosRequestConfig, CancelTokenSource } from "axios";
import { AppContext } from "../base/appcontext"; 

function rejectedInterceptor(error: any) {
  if (Axios.isCancel(error)) {
    return;
  }

  if (error.response.status === 401) {
    AppContext.missingAuth();
  }

  return Promise.reject(error);
}

// Axios.defaults.baseURL = `${API_URL}/admin`;

Axios.interceptors.request.use(async (arc: AxiosRequestConfig) => {
  const { headers } = arc;
    const token = AppContext.getToken();
    if (!token || headers && headers.token) {
      return arc;
    }
    return { ...arc, headers: { ...headers, token: token }, cancelToken: AppContext.getCancelToken() };
}, rejectedInterceptor);

Axios.interceptors.response.use((ar: AxiosResponse) => {
  const { data } = ar;
  if (data.error) {
    return Promise.reject(data.error.message);
  }
  if (!data.data) {
    return data;
  }
  return data.data;
}, rejectedInterceptor);

export class HttpClient {
  static async get<T = any>(url: string, params?: any): Promise<T> {
    return Axios.get(url, { params }) as Promise<any>;
  }

  static async post<T = any>(url: string, data?: any): Promise<T> {
    return Axios.post(url, data, {cancelToken: AppContext.getCancelToken()}) as Promise<any>;
  }

  static async put<T = any>(url: string, data: any = {}): Promise<T> {
    return Axios.put(url, data, {cancelToken: AppContext.getCancelToken()}) as Promise<any>;
  }

  static async delete<T = any>(url: string): Promise<T> {
    return Axios.delete(url, {cancelToken: AppContext.getCancelToken()}) as Promise<any>;
  }

  static async download<T = any>(url: string): Promise<T> {
    return Axios({url: url, method: "GET", responseType: "blob", cancelToken: AppContext.getCancelToken()}) as Promise<any>;
  }

  static async all<T = any>(request: any[]):  Promise<any> {
    return Axios.all(request)as  Promise<any>;
  }
}