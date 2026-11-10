export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export class CronLogger {
  private prefix: string;

  constructor(prefix: string = "CronEngine") {
    this.prefix = prefix;
  }

  private format(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] [${level}] [${this.prefix}] ${message}${metaStr}`;
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.format("DEBUG", message, meta));
    }
  }

  info(message: string, meta?: Record<string, unknown>): void {
    console.info(this.format("INFO", message, meta));
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(this.format("WARN", message, meta));
  }

  error(message: string, error?: unknown, meta?: Record<string, unknown>): void {
    const errMessage = error instanceof Error ? `${error.name}: ${error.message}\n${error.stack}` : String(error);
    console.error(this.format("ERROR", `${message} => ${errMessage}`, meta));
  }
}

export const defaultLogger = new CronLogger("CronEngine");

