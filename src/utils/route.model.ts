import { Handler } from "express";
import { HttpMethods } from "../enums/http-methods.enum";
import { UserRoles } from "../users/enums/user.roles.enum";
import { UserDepartments } from "../users/enums/user.departments.enum";

export type PermissionsMiddlewareConfig = {
  allowedRoles: UserRoles[];
  allowedDepartments: UserDepartments[];
};

export type PermissionsMiddleware = (config: PermissionsMiddlewareConfig) => Handler;

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
