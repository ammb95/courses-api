import { AppRouteModel } from "../utils/route.model";
import { UsersController } from "./users.controller";
import { UsersRoutePaths } from "./users.constants";
import { HttpMethods } from "../enums/http-methods.enum";

export const getUsersRoutes = (usersController: UsersController): AppRouteModel[] => [
  {
    method: HttpMethods.POST,
    path: UsersRoutePaths.BASE,
    handler: usersController.create,
  },
];
