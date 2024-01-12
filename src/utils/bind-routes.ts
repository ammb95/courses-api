import { Router } from "express";
import { AppRouteModel } from "./route.model";

export const bindRoutes = (router: Router, routes: AppRouteModel[]) => {
  routes.forEach(({ method, path, handler, authConfig }) => {
    if (authConfig) {
      router[method](path, authConfig.authMiddleware, authConfig.permissionsMiddleware, handler);
    } else {
      router[method](path, handler);
    }
  });
};
