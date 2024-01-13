import { UsersRepository } from "../users/users.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { getAuthRoutes } from "./auth.routes";
import { TokenManager } from "./utils/token-manager";
import { PasswordManager } from "./utils/password-manager";
import { SchemaValidator } from "../utils/schema-validator";
import { RoutingManager } from "../utils/routing-manager";
import { AUTH_ROUTE_NAMESPACE } from "./auth.constants";

export interface AuthModule {
  authGuard: AuthGuard;
}

export interface AuthModuleDeps {
  usersRepository: UsersRepository;
  routingManager: RoutingManager;
  schemaValidator: SchemaValidator;
  passwordManager: PasswordManager;
}

export const initAuthModule = ({
  usersRepository,
  schemaValidator,
  passwordManager,
  routingManager,
}: AuthModuleDeps): AuthModule => {
  const tokenManager = new TokenManager(usersRepository);

  const authGuard = new AuthGuard(tokenManager);

  const authService = new AuthService(
    usersRepository,
    tokenManager,
    passwordManager,
    schemaValidator
  );

  const authController = new AuthController(authService);

  const authRoutes = getAuthRoutes(authController);

  routingManager.createRouter({ basePath: AUTH_ROUTE_NAMESPACE, routes: authRoutes });

  return {
    authGuard,
  };
};
