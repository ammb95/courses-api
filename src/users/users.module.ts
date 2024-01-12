import express, { Router } from "express";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { getUsersRoutes } from "./users.routes";
import { bindRoutes } from "../utils/bind-routes";
import { SchemaValidator } from "../utils/schema-validator";
import { PasswordManager } from "../auth/utils/password-manager";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export interface UsersModule {
  usersRouter: Router;
  usersRepository: UsersRepository;
}

export interface UsersModuleProps {
  dbClient: DynamoDBClient;
  schemaValidator: SchemaValidator;
  passwordManager: PasswordManager;
}

export const initUsersModule = ({
  dbClient,
  schemaValidator,
  passwordManager,
}: UsersModuleProps): UsersModule => {
  const usersRepository = new UsersRepository(dbClient, passwordManager);
  const usersService = new UsersService(usersRepository, schemaValidator);
  const usersController = new UsersController(usersService);

  const usersRouter = express.Router();
  const usersRoutes = getUsersRoutes(usersController);

  bindRoutes(usersRouter, usersRoutes);

  return { usersRouter, usersRepository };
};
