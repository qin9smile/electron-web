import createBrowserHistory from 'history/createBrowserHistory';
import Axios, { CancelTokenSource } from "axios";
import { Cookies } from "../api/caches";
import { CACHE_KEYS } from "../commons/constaints";
import { api } from "../api/api";
export class AppContext {

  private static client_: api.Client;
  
  private static apiToken_: string;

  private static history_: any;

  public static missingAuth: Function;

  private static cancelSource_: CancelTokenSource;

  public static history(): any {
    if (!AppContext.history_) {
      const history = createBrowserHistory();
      AppContext.history_ = history;
    }

    return AppContext.history_;
  }

  public static removeToken() {
    console.log("remove token");

    AppContext.apiToken_ = "";
    AppContext.client_ = undefined;
    Cookies.remove(CACHE_KEYS.API_TOKEN_KEY);
  }

  public static getToken() {
    if (!AppContext.apiToken_) {
      const token: string = Cookies.get(CACHE_KEYS.API_TOKEN_KEY);

      if (token) {
        AppContext.apiToken_ = token;
      } else {
        AppContext.apiToken_ = "";
        AppContext.missingAuth();
      }
    }

    return AppContext.apiToken_;
  }

  public static cancelRequest(message: string = "Request canceled by user.") {
    if (AppContext.cancelSource_) {
      AppContext.cancelSource_.cancel(message);
    }
  }

  public static getCancelToken(): any {
    const cancelSource = Axios.CancelToken.source();
    AppContext.cancelSource_ = cancelSource;
    return AppContext.cancelSource_.token;
  }
}