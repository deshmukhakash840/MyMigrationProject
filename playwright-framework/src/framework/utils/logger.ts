export class LoggerUtil {
  static info(message: string, ...args: unknown[]): void {
    console.log(message, ...args);
  }

  static error(message: string, ...args: unknown[]): void {
    console.error(message, ...args);
  }

  static warn(message: string, ...args: unknown[]): void {
    console.warn(message, ...args);
  }
}
