import createBrowserHistory from 'history/createBrowserHistory';

export class AppContext {
  private static history_: any;

  static history(): any {
    if (!AppContext.history_) {
      const history = createBrowserHistory();
      AppContext.history_ = history;
    }

    return AppContext.history_;
  }
}