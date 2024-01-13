import { HttpStatusCodes } from "../../enums/http-status-codes.enum";
import { ErrorCodes } from "./error.codes.enum";

export const ERROR_CODES_TO_HTTP_STATUSES: Record<ErrorCodes, HttpStatusCodes> = {
  [ErrorCodes.NOT_FOUND]: HttpStatusCodes.NOT_FOUND,
  [ErrorCodes.FORBIDDEN]: HttpStatusCodes.FORBIDDEN,
  [ErrorCodes.SYNTAX_ERROR]: HttpStatusCodes.BAD_REQUEST,
  [ErrorCodes.UNAUTHORIZED]: HttpStatusCodes.UNAUTHORIZED,
  [ErrorCodes.CONFLICT]: HttpStatusCodes.CONFLICT,
  [ErrorCodes.PASSWORD_ERROR]: HttpStatusCodes.UNAUTHORIZED,
  [ErrorCodes.DATABASE_ERROR]: HttpStatusCodes.INTERNAL_SERVER_ERROR,
  [ErrorCodes.VALIDATION_ERROR]: HttpStatusCodes.UNPROCESSABLE_ENTITY,
  [ErrorCodes.INTERNAL_SERVER_ERROR]: HttpStatusCodes.INTERNAL_SERVER_ERROR,
};
