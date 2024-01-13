import { Handler, Router, Express } from "express";
import { AppRouteModel } from "./route.model";
import { ErrorCodes } from "../error-utils/enums/error.codes.enum";
import { BaseError } from "../error-utils/custom-errors/base-error";

export class RoutingManager {
  private routersMap: { basePath: string; router: Router }[] = [];

  constructor() {}

  private registerRoutes = (router: Router, routes: AppRouteModel[]): void => {
    routes.forEach(({ method, path, handler, authConfig }) => {
      if (authConfig) {
        router[method](path, authConfig.authMiddleware, authConfig.permissionsMiddleware, handler);
      } else {
        router[method](path, handler);
      }
    });
  };

  public createRouter = ({
    basePath,
    routes,
  }: {
    basePath: string;
    routes: AppRouteModel[];
  }): Router => {
    const router = Router();

    this.registerRoutes(router, routes);
    this.routersMap.push({ basePath, router });

    return router;
  };

  public attachRouters = (app: Express) => {
    this.routersMap.forEach(({ basePath, router }) => {
      app.use(basePath, router);
    });
  };

  public handleUnmatchedRoutes: Handler = (req, res, next) => {
    next(
      new BaseError({
        message: "Route Not Found",
        code: ErrorCodes.NOT_FOUND,
      })
    );
  };
}
