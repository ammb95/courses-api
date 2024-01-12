import { HttpMethods } from "../enums/http-methods.enum";
import { AppRouteModel } from "../utils/route.model";
import { AuthController } from "./auth.controller";

const AUTH_ROUTE_PATH = "auth";

export const getAuthRoutes = (authController: AuthController): AppRouteModel[] => [
  {
    method: HttpMethods.POST,
    path: `/${AUTH_ROUTE_PATH}/login`,
    handler: authController.login,
  },
  {
    method: HttpMethods.DELETE,
    path: `/${AUTH_ROUTE_PATH}/logout`,
    handler: authController.logout,
  },
];
