import { HTTP_METHODS_TO_COLORS } from "../enums/http-methods-to-colors.enum";
import { HttpMethods } from "../enums/http-methods.enum";
import { HTTP_STATUS_CODES_TO_COLORS } from "../enums/http-status-codes-to-colors";
import { HttpStatusCodes } from "../enums/http-status-codes.enum";
import { LogColors } from "../enums/log-colors.enum";
import { BaseError } from "../error-utils/custom-errors/base-error";
import { AppRouteModel } from "./route.model";

export class LogMessageFormatter {
  private getHttpStatusColor = (statusCode: HttpStatusCodes): LogColors => {
    return HTTP_STATUS_CODES_TO_COLORS[statusCode];
  };

  private getHttpMethodColor = (httpMethod: HttpMethods): LogColors => {
    return HTTP_METHODS_TO_COLORS[httpMethod.toLowerCase() as HttpMethods];
  };

  private getColoredHttpMethodString = (httpMethod: HttpMethods): string => {
    const methodColor = this.getHttpMethodColor(httpMethod);
    return `[${methodColor}${httpMethod.toUpperCase()}${LogColors.WHITE}]`;
  };

  private getColoredHttpStatusInfoString = (
    statusCode: HttpStatusCodes,
    statusMessage: string
  ): string => {
    const statusCodeColor = this.getHttpStatusColor(statusCode);
    return `${statusCodeColor}${statusCode} ${statusMessage}`;
  };

  private getRequestToResponseDuration = (start: number) => {
    return Date.now() - start;
  };

  public getRouteRegistrationLogMessage = ({
    method,
    path,
  }: Pick<AppRouteModel, "method" | "path">): string => {
    const coloredMethodString = this.getColoredHttpMethodString(method);
    return `${LogColors.BLUE}Route registered:${LogColors.WHITE} ${coloredMethodString} ${path}${LogColors.WHITE}`;
  };

  public getErrorLogMessage = (error: BaseError): string => {
    const coloredErrorPrefix = `[${LogColors.RED}ERROR${LogColors.WHITE}]`;
    return `${coloredErrorPrefix} ${error.code}: ${error.message}`;
  };

  public getHttpLogMessage = ({
    method,
    start,
    statusCode,
    statusMessage,
    url,
  }: {
    method: HttpMethods;
    start: number;
    statusCode: HttpStatusCodes;
    statusMessage: string;
    url: string;
  }): string => {
    const duration = this.getRequestToResponseDuration(start);
    const coloredMethodString = this.getColoredHttpMethodString(method);
    const coloredStatusInfo = this.getColoredHttpStatusInfoString(statusCode, statusMessage);

    return `${coloredMethodString} ${url} ${coloredStatusInfo} ${LogColors.WHITE} (${duration}ms)`;
  };

  public getServerLogMessage = (message: string): string => {
    return `[SERVER] ${message}`;
  };
}
