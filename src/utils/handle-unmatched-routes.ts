import { Handler } from "express";
import { HttpStatusCodes } from "../enums/http-status-codes.enum";
import { ErrorCodes } from "../error-utils/utils/error.codes.enum";
import { AppLogger } from "./app-logger";
import { BaseError } from "../error-utils/custom-errors/base-error";

export const handleUnmatchedRoutes =
  (appLogger: AppLogger): Handler =>
  (req, res, next) => {
    const message = "Route Not Found";

    appLogger.logError(new BaseError({ message, code: ErrorCodes.NOT_FOUND }));
    res.status(HttpStatusCodes.NOT_FOUND).json({ message, error: ErrorCodes.NOT_FOUND }).end();
  };
