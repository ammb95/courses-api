import express, { Router } from "express";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CoursesRepository } from "./courses.repository";
import { CoursesService } from "./courses.service";
import { CoursesController } from "./courses.controller";
import { getCoursesRoutes } from "./courses.routes";
import { bindRoutes } from "../utils/bind-routes";
import { SchemaValidator } from "../utils/schema-validator";
import { AuthGuard } from "../auth/auth.guard";

export interface CoursesModule {
  coursesRouter: Router;
}

export interface CoursesModuleProps {
  authGuard: AuthGuard;
  dbClient: DynamoDBClient;
  schemaValidator: SchemaValidator;
}

export const initCoursesModule = ({
  authGuard,
  dbClient,
  schemaValidator,
}: CoursesModuleProps): CoursesModule => {
  const coursesRepository = new CoursesRepository(dbClient);
  const coursesService = new CoursesService(coursesRepository, schemaValidator);
  const coursesController = new CoursesController(coursesService);

  const coursesRouter = express.Router();
  const coursesRoutes = getCoursesRoutes({ coursesController, authGuard });

  bindRoutes(coursesRouter, coursesRoutes);

  return { coursesRouter };
};
