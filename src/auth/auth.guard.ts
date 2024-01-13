import { Handler } from "express";
import { TokenManager } from "./utils/token-manager";
import { AuthError } from "../error-utils/custom-errors/auth.error";
import { ErrorCodes } from "../error-utils/utils/error.codes.enum";
import { PermissionsMiddleware, PermissionsMiddlewareConfig } from "../utils/route.model";

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

        const isUserAllowedByRole = user.roles.some((role) => config.allowedRoles.includes(role));

        const isUserAllowedByDepartment = config.allowedDepartments.includes(user.department);

        if (isUserAllowedByRole && isUserAllowedByDepartment) {
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
