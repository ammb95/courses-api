import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../../enums/http-status-codes.enum";
import { BaseError } from "./base-error";
import { ERROR_CODES_TO_HTTP_STATUSES } from "../enums/error-codes-to-http-status-map";
import { ErrorCodes } from "../enums/error.codes.enum";
import { Logger } from "../../utils/logger";

export class ErrorHandler {
  constructor(private readonly logger: Logger) {}

  private getErrorStatusCode = (error: BaseError): HttpStatusCodes => {
    return ERROR_CODES_TO_HTTP_STATUSES[error.code];
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

    this.logger.logError(error);
    res.status(statusCode).json({ error: error.code, message: error.message }).end();
  };
}
