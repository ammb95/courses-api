import { AppRouteModel } from "../utils/route.model";
import { COURSES_ROUTE_PATH } from "./courses.constants";
import { CoursesController } from "./courses.controller";
import { AuthService } from "../auth/auth.service";
import { UserDepartments } from "../users/enums/user.departments.enum";
import { UserRoles } from "../users/enums/user.roles.enum";
import { HttpMethods } from "../enums/http-methods.enum";

const coursesRoutesAllowedRoles: UserRoles[] = [UserRoles.ADMINISTRATOR, UserRoles.MANAGER];
const coursesRoutesAllowedDepartments: UserDepartments[] = [UserDepartments.MARKETING];

export const getCoursesRoutes = ({
  coursesController,
  authService,
}: {
  coursesController: CoursesController;
  authService: AuthService;
}): AppRouteModel[] => [
  {
    method: HttpMethods.GET,
    path: `/${COURSES_ROUTE_PATH}`,
    handler: coursesController.getAll,
    authConfig: {
      authMiddleware: authService.authenticate,
      permissionsMiddleware: authService.checkPermissionsFactory(
        coursesRoutesAllowedRoles,
        coursesRoutesAllowedDepartments
      ),
    },
  },
  {
    method: HttpMethods.GET,
    path: `/${COURSES_ROUTE_PATH}/:id`,
    handler: coursesController.getById,
    authConfig: {
      authMiddleware: authService.authenticate,
      permissionsMiddleware: authService.checkPermissionsFactory(
        coursesRoutesAllowedRoles,
        coursesRoutesAllowedDepartments
      ),
    },
  },
  {
    method: HttpMethods.POST,
    path: `/${COURSES_ROUTE_PATH}`,
    handler: coursesController.create,
    authConfig: {
      authMiddleware: authService.authenticate,
      permissionsMiddleware: authService.checkPermissionsFactory(
        coursesRoutesAllowedRoles,
        coursesRoutesAllowedDepartments
      ),
    },
  },
  {
    method: HttpMethods.PATCH,
    path: `/${COURSES_ROUTE_PATH}/:id`,
    handler: coursesController.edit,
    authConfig: {
      authMiddleware: authService.authenticate,
      permissionsMiddleware: authService.checkPermissionsFactory(
        coursesRoutesAllowedRoles,
        coursesRoutesAllowedDepartments
      ),
    },
  },
  {
    method: HttpMethods.DELETE,
    path: `/${COURSES_ROUTE_PATH}/:id`,
    handler: coursesController.delete,
    authConfig: {
      authMiddleware: authService.authenticate,
      permissionsMiddleware: authService.checkPermissionsFactory(
        coursesRoutesAllowedRoles,
        coursesRoutesAllowedDepartments
      ),
    },
  },
];
