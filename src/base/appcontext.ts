import createBrowserHistory from 'history/createBrowserHistory';

export class AppContext {
  private static history_: any;

  public static missingAuth: Function;

  public static history(): any {
    if (!AppContext.history_) {
      const history = createBrowserHistory();
      AppContext.history_ = history;
    }

    return AppContext.history_;
  }

  public static removeToken() {
    console.log("remove token");
  }
}