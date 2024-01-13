import express, { Router } from "express";
import { UsersRepository } from "../users/users.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { getAuthRoutes } from "./auth.routes";
import { bindRoutes } from "../utils/bind-routes";
import { TokenManager } from "./utils/token-manager";
import { PasswordManager } from "./utils/password-manager";
import { SchemaValidator } from "../utils/schema-validator";

export interface AuthModule {
  authGuard: AuthGuard;
  authRouter: Router;
}

export interface AuthModuleProps {
  usersRepository: UsersRepository;
  schemaValidator: SchemaValidator;
  passwordManager: PasswordManager;
}

export const initAuthModule = ({
  usersRepository,
  schemaValidator,
  passwordManager,
}: AuthModuleProps): AuthModule => {
  const tokenManager = new TokenManager(usersRepository);

  const authGuard = new AuthGuard(tokenManager);

  const authService = new AuthService(
    usersRepository,
    tokenManager,
    passwordManager,
    schemaValidator
  );

  const authController = new AuthController(authService);

  const authRouter = express.Router();
  const authRoutes = getAuthRoutes(authController);

  bindRoutes(authRouter, authRoutes);

  return {
    authGuard,
    authRouter,
  };
};
