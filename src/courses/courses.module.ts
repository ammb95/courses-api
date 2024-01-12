import express, { Router } from "express";
import { CoursesRepository } from "./courses.repository";
import { CoursesService } from "./courses.service";
import { CoursesController } from "./courses.controller";
import { getCoursesRoutes } from "./courses.routes";
import { bindRoutes } from "../utils/bind-routes";
import { AuthService } from "../auth/auth.service";
import { SchemaValidator } from "../utils/schema-validator";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export interface CoursesModule {
  coursesRouter: Router;
}

export interface CoursesModuleProps {
  authService: AuthService;
  dbClient: DynamoDBClient;
  schemaValidator: SchemaValidator;
}

export const initCoursesModule = ({
  authService,
  dbClient,
  schemaValidator,
}: CoursesModuleProps): CoursesModule => {
  const coursesRepository = new CoursesRepository(dbClient);
  const coursesService = new CoursesService(coursesRepository, schemaValidator);
  const coursesController = new CoursesController(coursesService);

  const coursesRouter = express.Router();
  const coursesRoutes = getCoursesRoutes({ coursesController, authService });

  bindRoutes(coursesRouter, coursesRoutes);

  return { coursesRouter };
};
