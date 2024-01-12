import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../enums/http-status-codes.enum";
import { BaseError } from "./custom-errors/base-error";
import { ERROR_CODES_TO_HTTP_STATUSES_MAP } from "./utils/error-code-http-status-map";
import { ErrorCodes } from "./utils/error.codes.enum";
import { AppLogger } from "../utils/app-logger";

export class ErrorHandler {
  constructor(private readonly appLogger: AppLogger) {}

  private getErrorStatusCode = (error: BaseError): HttpStatusCodes => {
    return ERROR_CODES_TO_HTTP_STATUSES_MAP[error.code];
  };

  public handleErrorMiddleware = (
    error: BaseError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (error instanceof SyntaxError) {
      error.code = ErrorCodes.SYNTAX_ERROR;
    }

    const statusCode = this.getErrorStatusCode(error);

    this.appLogger.logError(error);
    res.status(statusCode).json({ error: error.code, message: error.message }).end();
  };
}
