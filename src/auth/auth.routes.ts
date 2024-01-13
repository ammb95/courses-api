import { HttpMethods } from "../enums/http-methods.enum";
import { AppRouteModel } from "../utils/route.model";
import { AuthRoutePaths } from "./auth.constants";
import { AuthController } from "./auth.controller";

export const getAuthRoutes = (authController: AuthController): AppRouteModel[] => [
  {
    method: HttpMethods.POST,
    path: AuthRoutePaths.LOGIN,
    handler: authController.login,
  },
  {
    method: HttpMethods.DELETE,
    path: AuthRoutePaths.LOGOUT,
    handler: authController.logout,
  },
];
