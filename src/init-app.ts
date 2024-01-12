import express, { Express } from "express";
import { getEnvVariables } from "./utils/get-env-variables";
import { ErrorHandler } from "./error-utils/error-handler";
import { AppLogger } from "./utils/app-logger";
import { DBManager } from "./db/db-manager";
import { initUsersModule } from "./users/users.module";
import { initCoursesModule } from "./courses/courses.module";
import { initAuthModule } from "./auth/auth.module";
import { configCors } from "./utils/config-cors";
import { handleUnmatchedRoutes } from "./utils/handle-unmatched-routes";
import { SchemaValidator } from "./utils/schema-validator";
import { PasswordManager } from "./auth/utils/password-manager";
import { APP_DEFAULT_PORT } from "./app.constants";

export const initApp = async (app: Express) => {
  const { APP_PORT } = getEnvVariables();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(configCors);

  const appLogger = new AppLogger();
  app.use(appLogger.loggerMiddleware);

  const passwordManager = new PasswordManager();

  const dbManager = new DBManager(passwordManager);
  await dbManager.setupDatabase();

  const schemaValidator = new SchemaValidator();

  const { usersRouter, usersRepository } = initUsersModule({
    dbClient: dbManager.dbClient,
    schemaValidator,
    passwordManager,
  });
  const { authRouter, authService } = initAuthModule({
    usersRepository,
    schemaValidator,
    passwordManager,
  });
  const { coursesRouter } = initCoursesModule({
    authService,
    dbClient: dbManager.dbClient,
    schemaValidator,
  });

  app.use(usersRouter);
  app.use(authRouter);
  app.use(coursesRouter);

  app.use(handleUnmatchedRoutes(appLogger));

  const errorHandler = new ErrorHandler(appLogger);
  app.use(errorHandler.handleErrorMiddleware);

  const port = APP_PORT || APP_DEFAULT_PORT;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}\n`);
  });
};
