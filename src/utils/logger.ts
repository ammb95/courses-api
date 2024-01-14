import { Handler } from "express";
import { BaseError } from "../error-utils/custom-errors/base-error";
import { HttpMethods } from "../enums/http-methods.enum";
import { LogMessageFormatter } from "./log-message-formatter";

export class Logger {
  private logMessageFormatter = new LogMessageFormatter();

  public logError = (error: BaseError): void => {
    console.log(this.logMessageFormatter.getErrorLogMessage(error));
  };

  public httpLoggerMiddleware: Handler = (req, res, next): void => {
    const start = Date.now();

    res.on("finish", () => {
      console.log(
        this.logMessageFormatter.getHttpLogMessage({
          method: req.method as HttpMethods,
          start,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          url: req.originalUrl,
        })
      );
    });

    next();
  };

  public logMessage = (message: string): void => {
    console.log(this.logMessageFormatter.getServerLogMessage(message));
  };
}
