import { Handler } from "express";
import { TokenManager } from "./utils/token-manager";
import { AuthError } from "../error-utils/custom-errors/auth.error";
import { ErrorCodes } from "../error-utils/enums/error.codes.enum";
import { UserDepartments } from "../users/enums/user.departments.enum";
import { UserRoles } from "../users/enums/user.roles.enum";

export type PermissionsMiddlewareConfig = {
  allowedRoles: UserRoles[];
  allowedDepartments: UserDepartments[];
};

export type PermissionsMiddleware = (config: PermissionsMiddlewareConfig) => Handler;
export class AuthGuard {
  constructor(private readonly tokenManager: TokenManager) {}
  public authenticate: Handler = async (req, res, next): Promise<void> => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AuthError({
          message: "No Token Provided",
          code: ErrorCodes.UNAUTHORIZED,
        });
      }

      const isTokenValid = await this.tokenManager.validateToken(token);

      if (!isTokenValid) {
        throw new AuthError({
          message: "Invalid Token",
          code: ErrorCodes.UNAUTHORIZED,
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };

  public checkPermissions: PermissionsMiddleware = (config: PermissionsMiddlewareConfig) => {
    return (req, res, next) => {
      try {
        const token = req.headers.authorization as string;

        const user = this.tokenManager.getUserFromToken(token);

        const isAllowedByRole = user.roles.some((role) => config.allowedRoles.includes(role));
        const isAllowedByDepartment = config.allowedDepartments.includes(user.department);

        if (isAllowedByRole && isAllowedByDepartment) {
          next();
        } else {
          throw new AuthError({
            message: "Insufficient permissions",
            code: ErrorCodes.FORBIDDEN,
          });
        }
      } catch (error) {
        next(error);
      }
    };
  };
}
