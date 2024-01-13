import { LoginDto } from "../models/auth.dtos";
import { UserDepartments } from "../../users/enums/user.departments.enum";
import { UserRoles } from "../../users/enums/user.roles.enum";
import { PermissionsMiddlewareConfig } from "../auth.guard";

export const mockToken = "validToken";
export const invalidMockToken = "invalidToken";

export const mockCredentials: LoginDto = {
  username: "username",
  password: "password",
};

export const invalidMockCredentials = {
  username: "invalidUser",
} as LoginDto;

export const invalidUsernameMockCredentials: LoginDto = {
  username: "invalidUsername",
  password: "password",
};

export const invalidPasswordMockCredentials: LoginDto = {
  username: "username",
  password: "invalidPassword",
};

export const mockRouteAllowedRoles = [UserRoles.ADMINISTRATOR];
export const mockRouteAllowedDepartments = [UserDepartments.MARKETING];
export const mockPermissionsConfig: PermissionsMiddlewareConfig = {
  allowedRoles: mockRouteAllowedRoles,
  allowedDepartments: mockRouteAllowedDepartments,
};

export const validAuthorizationMockHeaders = { authorization: mockToken };
export const invalidAuthorizationMockHeaders = { authorization: invalidMockToken };
export const missingTokenMockHeaders = {};
