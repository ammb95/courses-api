import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CoursesRepository } from "./courses.repository";
import { CoursesService } from "./courses.service";
import { CoursesController } from "./courses.controller";
import { getCoursesRoutes } from "./courses.routes";
import { SchemaValidator } from "../utils/schema-validator";
import { AuthGuard } from "../auth/auth.guard";
import { RoutingManager } from "../utils/routing-manager";
import { COURSES_ROUTE_NAMESPACE } from "./courses.constants";
import { Logger } from "../utils/logger";

export interface CoursesModuleDeps {
  authGuard: AuthGuard;
  dbClient: DynamoDBClient;
  routingManager: RoutingManager;
  schemaValidator: SchemaValidator;
  logger: Logger;
}

export class CoursesModule {}

export const initCoursesModule = ({
  authGuard,
  dbClient,
  schemaValidator,
  routingManager,
  logger,
}: CoursesModuleDeps) => {
  logger.logMessage("Starting Courses Module");

  const coursesRepository = new CoursesRepository(dbClient);
  const coursesService = new CoursesService(coursesRepository, schemaValidator);
  const coursesController = new CoursesController(coursesService);

  const coursesRoutes = getCoursesRoutes({ coursesController, authGuard });
  routingManager.createRouter({ basePath: COURSES_ROUTE_NAMESPACE, routes: coursesRoutes });

  logger.logMessage("Courses Module Started Successfully");
};
