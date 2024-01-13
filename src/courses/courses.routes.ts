import { AppRouteModel } from "../utils/route.model";
import { COURSES_ROUTES_PERMISSIONS_CONFIG, CoursesRoutePaths } from "./courses.constants";
import { CoursesController } from "./courses.controller";
import { HttpMethods } from "../enums/http-methods.enum";
import { AuthGuard } from "../auth/auth.guard";

export const getCoursesRoutes = ({
  coursesController,
  authGuard,
}: {
  coursesController: CoursesController;
  authGuard: AuthGuard;
}): AppRouteModel[] => [
  {
    method: HttpMethods.GET,
    path: CoursesRoutePaths.BASE,
    handler: coursesController.getAll,
    authConfig: {
      authMiddleware: authGuard.authenticate,
      permissionsMiddleware: authGuard.checkPermissions(COURSES_ROUTES_PERMISSIONS_CONFIG),
    },
  },
  {
    method: HttpMethods.GET,
    path: CoursesRoutePaths.BY_ID,
    handler: coursesController.getById,
    authConfig: {
      authMiddleware: authGuard.authenticate,
      permissionsMiddleware: authGuard.checkPermissions(COURSES_ROUTES_PERMISSIONS_CONFIG),
    },
  },
  {
    method: HttpMethods.POST,
    path: CoursesRoutePaths.BASE,
    handler: coursesController.create,
    authConfig: {
      authMiddleware: authGuard.authenticate,
      permissionsMiddleware: authGuard.checkPermissions(COURSES_ROUTES_PERMISSIONS_CONFIG),
    },
  },
  {
    method: HttpMethods.PATCH,
    path: CoursesRoutePaths.BY_ID,
    handler: coursesController.edit,
    authConfig: {
      authMiddleware: authGuard.authenticate,
      permissionsMiddleware: authGuard.checkPermissions(COURSES_ROUTES_PERMISSIONS_CONFIG),
    },
  },
  {
    method: HttpMethods.DELETE,
    path: CoursesRoutePaths.BY_ID,
    handler: coursesController.delete,
    authConfig: {
      authMiddleware: authGuard.authenticate,
      permissionsMiddleware: authGuard.checkPermissions(COURSES_ROUTES_PERMISSIONS_CONFIG),
    },
  },
];
