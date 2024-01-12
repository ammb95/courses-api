import { Handler } from "express";
import { UserDepartments } from "../users/enums/user.departments.enum";
import { UserRoles } from "../users/enums/user.roles.enum";
import { HttpMethods } from "../enums/http-methods.enum";

export type PermissionsMiddleware = (
  allowedRoles: UserRoles[],
  allowedDepartments: UserDepartments[]
) => Handler;

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
