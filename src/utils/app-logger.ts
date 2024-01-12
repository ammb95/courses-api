import { Handler } from "express";
import { BaseError } from "../error-utils/custom-errors/base-error";
import { HttpStatusCodes } from "../enums/http-status-codes.enum";

// ANSI escape codes for text color
const COLOR_GREEN = "\x1b[32m";
const COLOR_RED = "\x1b[31m";
const COLOR_RESET = "\x1b[0m";

type LogMessageProps = {
  url: string;
  method: string;
  statusCode: number;
  statusMessage: string;
  duration: number;
};

export class AppLogger {
  private getStatusCodeColor = (statusCode: HttpStatusCodes) => {
    return statusCode >= 200 && statusCode < 300 ? COLOR_GREEN : COLOR_RED;
  };

  private getMessage = ({
    url,
    method,
    statusCode,
    statusMessage,
    duration,
  }: LogMessageProps): string => {
    const statusCodeColor = this.getStatusCodeColor(statusCode);
    const coloredStatusInfo = `${statusCodeColor}${statusCode} ${statusMessage}`;

    return `${method} ${url} ${coloredStatusInfo} ${COLOR_RESET} (${duration}ms)`;
  };

  private getDuration = (start: number) => {
    return Date.now() - start;
  };

  public loggerMiddleware: Handler = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
      const message = this.getMessage({
        url: req.url,
        method: req.method,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        duration: this.getDuration(start),
      });

      console.log(message);
    });

    next();
  };

  public logError = (error: BaseError): void => {
    console.log(`${COLOR_RED}ERROR${COLOR_RESET} [${error.code}]: ${error.message}`);
  };
}
