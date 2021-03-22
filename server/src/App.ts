import express from "express";
import config from "./config";
import {registerRouter} from "./routes";
import {mongoConnecter} from "./connections";
import {errorConverter, errorHandler} from "./middleware/errors";
import httpStatus from "http-status";
import logger from "./utils/logger";
import ApiError from "./utils/apiError";

export default class App {
  private readonly app: express.Application;

  constructor() {
    this.app = express();
    this.configApp();
    this.initRoutes();
  }

  public getApp(): express.Application {
    return this.app;
  }

  async run(): Promise<void> {
    await this.connect();
    this.app.listen(config.port, () => {
      logger.info(`[App] Server is running on port http://localhost:${config.port}`);
    });
  }

  connect(): Promise<any[]> {
    return Promise.all([mongoConnecter.connect()]);
  }

  private initRoutes(): void {
    this.app.use("/register", registerRouter);
    this.app.use("/*", (req, res, next) => next(new ApiError(httpStatus.NOT_FOUND, "Not found")));
    this.app.use(errorConverter);
    this.app.use(errorHandler);
  }

  private configApp(): void {
    this.app.use(express.json());
    // this.app.use(attachErrorHandler); // what is this middleware?
  }
}
