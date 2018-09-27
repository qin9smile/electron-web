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