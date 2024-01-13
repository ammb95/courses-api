import express, { Express } from "express";
import { getEnvVariables } from "./utils/get-env-variables";
import { ErrorHandler } from "./error-utils/custom-errors/error-handler";
import { Logger } from "./utils/logger";
import { DBManager } from "./db/db-manager";
import { initUsersModule } from "./users/users.module";
import { initCoursesModule } from "./courses/courses.module";
import { initAuthModule } from "./auth/auth.module";
import { configCors } from "./utils/config-cors";
import { SchemaValidator } from "./utils/schema-validator";
import { PasswordManager } from "./auth/utils/password-manager";
import { APP_DEFAULT_PORT } from "./app.constants";
import { RoutingManager } from "./utils/routing-manager";

export const initApp = async (app: Express) => {
  const { APP_PORT } = getEnvVariables();
  const port = APP_PORT || APP_DEFAULT_PORT;

  const logger = new Logger();
  const routingManager = new RoutingManager();
  const passwordManager = new PasswordManager();
  const schemaValidator = new SchemaValidator();
  const errorHandler = new ErrorHandler(logger);
  const dbManager = new DBManager(passwordManager, logger);

  await dbManager.initializeDatabaseSeed();

  const { usersRepository } = initUsersModule({
    dbClient: dbManager.dbClient,
    routingManager,
    schemaValidator,
    passwordManager,
  });
  const { authGuard } = initAuthModule({
    usersRepository,
    routingManager,
    schemaValidator,
    passwordManager,
  });

  initCoursesModule({
    authGuard,
    dbClient: dbManager.dbClient,
    routingManager,
    schemaValidator,
  });

  app.use(configCors);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(logger.httpLoggerMiddleware);

  routingManager.attachRouters(app);

  app.use(routingManager.handleUnmatchedRoutes);
  app.use(errorHandler.handleErrorMiddleware);

  app.listen(port, () => {
    logger.logMessage(`Listening on http://localhost:${port}\n`);
  });
};
