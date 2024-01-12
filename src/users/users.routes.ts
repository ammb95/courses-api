import { AppRouteModel } from "../utils/route.model";
import { UsersController } from "./users.controller";
import { USERS_ROUTE_PATH } from "./users.constants";
import { HttpMethods } from "../enums/http-methods.enum";

export const getUsersRoutes = (usersController: UsersController): AppRouteModel[] => [
  {
    method: HttpMethods.POST,
    path: `/${USERS_ROUTE_PATH}`,
    handler: usersController.create,
  },
];
