import { Handler } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./models/auth.dtos";
import { AuthError } from "../error-utils/custom-errors/auth.error";
import { ErrorCodes } from "../error-utils/enums/error.codes.enum";
import { HttpStatusCodes } from "../enums/http-status-codes.enum";

export class AuthController {
  constructor(private authService: AuthService) {}

  login: Handler = async (req, res, next): Promise<void> => {
    try {
      const credentials: LoginDto = req.body;

      const token = await this.authService.login(credentials);

      res.status(HttpStatusCodes.OK).json({ token });
    } catch (error) {
      next(error);
    }
  };

  logout: Handler = async (req, res, next): Promise<void> => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AuthError({
          message: "No token provided",
          code: ErrorCodes.UNAUTHORIZED,
        });
      }
      await this.authService.logout(token);

      res.status(HttpStatusCodes.NO_CONTENT).end();
    } catch (error) {
      next(error);
    }
  };
}
