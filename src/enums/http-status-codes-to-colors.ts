import { HttpStatusCodes } from "./http-status-codes.enum";
import { LogColors } from "./log-colors.enum";

export const HTTP_STATUS_CODES_TO_COLORS: Record<HttpStatusCodes, LogColors> = {
  [HttpStatusCodes.OK]: LogColors.GREEN,
  [HttpStatusCodes.CREATED]: LogColors.GREEN,
  [HttpStatusCodes.NO_CONTENT]: LogColors.GREEN,
  [HttpStatusCodes.BAD_REQUEST]: LogColors.RED,
  [HttpStatusCodes.UNAUTHORIZED]: LogColors.RED,
  [HttpStatusCodes.FORBIDDEN]: LogColors.RED,
  [HttpStatusCodes.NOT_FOUND]: LogColors.RED,
  [HttpStatusCodes.CONFLICT]: LogColors.RED,
  [HttpStatusCodes.UNPROCESSABLE_ENTITY]: LogColors.YELLOW,
  [HttpStatusCodes.INTERNAL_SERVER_ERROR]: LogColors.MAGENTA,
};
