import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { getUsersRoutes } from "./users.routes";
import { SchemaValidator } from "../utils/schema-validator";
import { PasswordManager } from "../auth/utils/password-manager";
import { RoutingManager } from "../utils/routing-manager";
import { USERS_ROUTER_NAMESPACE } from "./users.constants";
import { Logger } from "../utils/logger";

export interface UsersModule {
  usersRepository: UsersRepository;
}

export interface UsersModuleDeps {
  dbClient: DynamoDBClient;
  routingManager: RoutingManager;
  schemaValidator: SchemaValidator;
  passwordManager: PasswordManager;
  logger: Logger;
}

export const initUsersModule = ({
  dbClient,
  schemaValidator,
  passwordManager,
  routingManager,
  logger,
}: UsersModuleDeps): UsersModule => {
  logger.logMessage("Starting Users Module");

  const usersRepository = new UsersRepository(dbClient, passwordManager);
  const usersService = new UsersService(usersRepository, schemaValidator);
  const usersController = new UsersController(usersService);

  const usersRoutes = getUsersRoutes(usersController);

  routingManager.createRouter({ basePath: USERS_ROUTER_NAMESPACE, routes: usersRoutes });

  logger.logMessage("Users Module Started Successfully");

  return { usersRepository };
};
