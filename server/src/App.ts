import express from "express";
import session from "express-session";
import cors from "cors";
import httpStatus from "http-status";
import config from "./config";
import {registerRouter, checkinRouter, loginRouter, logoutRouter} from "./routes";
import {mongoConnecter, mongoStore} from "./connections";
import {errorConverter, errorHandler} from "./middleware/errors";
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
    // TEMP to log Session data
    this.app.use("/", (req, res, next) => {
      logger.info("[Cookie] " + (req.headers.cookie || "not set"));
      logger.info("[Session] " + req.sessionID);
      next();
    });

    this.app.use("/register", registerRouter);
    this.app.use("/checkin", checkinRouter);
    this.app.use("/login", loginRouter);
    this.app.use("/logout", logoutRouter);

    this.app.use("/*", (req, res, next) => next(new ApiError(httpStatus.NOT_FOUND, "Not found")));

    this.app.use(errorConverter);
    this.app.use(errorHandler);
  }

  private configApp(): void {
    this.app.use(cors(config.cors));
    this.app.use(express.json());
    const store = config.env === "test" ? undefined : mongoStore;
    this.app.use(session({...config.session, store}));
  }
}
