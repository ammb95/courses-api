import { Handler } from "express";
import { HttpMethods } from "../enums/http-methods.enum";

export interface AppRouteAuthConfig {
  authMiddleware: Handler;
  permissionsMiddleware: Handler;
}

export interface AppRouteModel {
  method: HttpMethods;
  path: string;
  handler: Handler;
  authConfig?: AppRouteAuthConfig;
}
