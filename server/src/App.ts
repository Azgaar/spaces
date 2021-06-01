import path from 'path';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import config from './config';
import * as Routes from './routes';
import {mongoConnecter, mongoStore} from './connections';
import {errorConverter, errorHandler} from './middleware/errors';
import logger from './utils/logger';

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

  connect(): Promise<unknown[]> {
    return Promise.all([mongoConnecter.connect()]);
  }

  private initRoutes(): void {
    this.app.use(express.static(path.resolve(__dirname, '../../../client/build')));

    this.app.use('/users', Routes.users);
    this.app.use('/login', Routes.login);
    this.app.use('/logout', Routes.logout);
    this.app.use('/checkin', Routes.checkin);
    this.app.use('/forgotPassword', Routes.forgotPassword);
    this.app.use('/getLocations', Routes.getLocations);
    this.app.use('/addLocation', Routes.addLocation);
    this.app.use('/locations', Routes.locations);
    this.app.use('/deleteLocation', Routes.deleteLocation);
    this.app.use('/getWorkspaces', Routes.getWorkspaces);
    this.app.use('/addWorkspace', Routes.addWorkspace);
    this.app.use('/updateWorkspace', Routes.updateWorkspace);
    this.app.use('/deleteWorkspaces', Routes.deleteWorkspaces);
    this.app.use('/findWorkspaces', Routes.findWorkspaces);
    this.app.use('/getReservations', Routes.getReservations);
    this.app.use('/addReservation', Routes.addReservation);
    this.app.use('/updateReservation', Routes.updateReservation);
    this.app.use('/deleteReservations', Routes.deleteReservations);
    this.app.use('/getUserReservations', Routes.getUserReservations);
    this.app.use('/deleteUserReservations', Routes.deleteUserReservations);
    this.app.use('/requestServices', Routes.requestServices);
    this.app.use('/removeUserService', Routes.removeUserService);
    this.app.use('/getServices', Routes.getServices);
    this.app.use('/processServices', Routes.processServices);
    this.app.use('/deleteServices', Routes.deleteServices);

    this.app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../../../client/build', 'index.html')));

    this.app.use(errorConverter);
    this.app.use(errorHandler);
  }

  private configApp(): void {
    this.app.use(cors(config.cors));
    this.app.use(express.json());
    const store = config.env === 'test' ? undefined : mongoStore;
    this.app.use(session({...config.session, store}));
  }
}
