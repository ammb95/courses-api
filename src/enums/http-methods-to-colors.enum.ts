import { HttpMethods } from "./http-methods.enum";
import { LogColors } from "./log-colors.enum";

export const HTTP_METHODS_TO_COLORS: Record<HttpMethods, LogColors> = {
  [HttpMethods.GET]: LogColors.BLUE,
  [HttpMethods.POST]: LogColors.GREEN,
  [HttpMethods.PUT]: LogColors.YELLOW,
  [HttpMethods.PATCH]: LogColors.YELLOW,
  [HttpMethods.DELETE]: LogColors.RED,
};
