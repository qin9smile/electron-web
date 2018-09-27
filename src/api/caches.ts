export class Cookies {
  static set(name: string, value: string) {
    localStorage.setItem(name, value);
  }

  static get(name: string): string {
    return localStorage.getItem(name);
  }
  
  static remove(name: string) {
    return localStorage.removeItem(name);
  }

  static clear() {
    return localStorage.clear();
  }
}