import path from 'path';

export class ExecutionContext {
  static getRunId(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  static getReportPath(): string {
    return path.resolve(process.cwd(), 'test-results', 'report', `report-${this.getRunId()}.html`);
  }

  static getLogPath(): string {
    return path.resolve(process.cwd(), 'test-results', 'logs', `framework-${this.getRunId()}.log`);
  }

  static getScreenshotPath(testName: string): string {
    return path.resolve(process.cwd(), 'test-results', 'screenshots', `${testName}-${this.getRunId()}.png`);
  }
}
