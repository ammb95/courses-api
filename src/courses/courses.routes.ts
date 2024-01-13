import { AppRouteModel } from "../utils/route.model";
import { COURSES_PERMISSIONS_CONFIG, COURSES_ROUTE_PATH } from "./courses.constants";
import { CoursesController } from "./courses.controller";
import { HttpMethods } from "../enums/http-methods.enum";
import { AuthGuard } from "../auth/auth.guard";

export const getCoursesRoutes = ({
  coursesController,
  authGuard: authGuard,
}: {
  coursesController: CoursesController;
  authGuard: AuthGuard;
}): AppRouteModel[] => [
  {
    method: HttpMethods.GET,
    path: `/${COURSES_ROUTE_PATH}`,
    handler: coursesController.getAll,
    authConfig: {
      authMiddleware: authGuard.authenticate,
      permissionsMiddleware: authGuard.checkPermissions(COURSES_PERMISSIONS_CONFIG),
    },
  },
  {
    method: HttpMethods.GET,
    path: `/${COURSES_ROUTE_PATH}/:id`,
    handler: coursesController.getById,
    authConfig: {
      authMiddleware: authGuard.authenticate,
      permissionsMiddleware: authGuard.checkPermissions(COURSES_PERMISSIONS_CONFIG),
    },
  },
  {
    method: HttpMethods.POST,
    path: `/${COURSES_ROUTE_PATH}`,
    handler: coursesController.create,
    authConfig: {
      authMiddleware: authGuard.authenticate,
      permissionsMiddleware: authGuard.checkPermissions(COURSES_PERMISSIONS_CONFIG),
    },
  },
  {
    method: HttpMethods.PATCH,
    path: `/${COURSES_ROUTE_PATH}/:id`,
    handler: coursesController.edit,
    authConfig: {
      authMiddleware: authGuard.authenticate,
      permissionsMiddleware: authGuard.checkPermissions(COURSES_PERMISSIONS_CONFIG),
    },
  },
  {
    method: HttpMethods.DELETE,
    path: `/${COURSES_ROUTE_PATH}/:id`,
    handler: coursesController.delete,
    authConfig: {
      authMiddleware: authGuard.authenticate,
      permissionsMiddleware: authGuard.checkPermissions(COURSES_PERMISSIONS_CONFIG),
    },
  },
];
