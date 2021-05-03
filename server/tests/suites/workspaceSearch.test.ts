import request from 'supertest';
import httpStatus from 'http-status';
import App from '../../src/App';
import config from '../../src/config';
import {MongoMemory, extractCookies} from '../utils';
import {UserData, UserRole, WorkspaceData, WorkspaceStatus, WorkspaceType, LocationData, Equipment, ReservationData} from '../../src/types';
import {createUser} from '../../src/services/user';
import locationService from '../../src/services/location';
import workspaceService from '../../src/services/workspace';
import reservationService from '../../src/services/reservation';

const app = new App().getApp();
const cookie = {user: ''};

// test dates
const HOUR: number = 1000 * 60 * 60;
const CURRENT: Date = new Date();
const IN_1_HOUR: Date = new Date(CURRENT.getTime() + HOUR);
const IN_2_HOURS: Date = new Date(CURRENT.getTime() + HOUR * 2);
const IN_3_HOURS: Date = new Date(CURRENT.getTime() + HOUR * 3);

const user: UserData = {email: 'user@reg.com', firstName: 'Jane', lastName: 'Dowson', password: 'Secret1234', role: UserRole.USER};
const location: LocationData = {description: 'testLoc1'};
const wsDesk: WorkspaceData = {description: 'WS_1', location: '', status: WorkspaceStatus.AVAILABLE, type: WorkspaceType.DESK, size: 1, equipment: [Equipment.HEADSET]};
const wsCoworking: WorkspaceData = {
  description: 'WS_2',
  location: '',
  status: WorkspaceStatus.AVAILABLE,
  type: WorkspaceType.COWORKING,
  size: 6,
  equipment: [Equipment.TELEPHONE, Equipment.COUCH]
};
const wsUnavailable: WorkspaceData = {description: 'WS_3', location: '', status: WorkspaceStatus.UNAVAILABLE, type: WorkspaceType.DESK, size: 1, equipment: []};
const reservation: ReservationData = {location: location.id as string, workspace: '', requester: user.email, from: IN_1_HOUR, to: IN_2_HOURS};

describe('Workspace search', () => {
  beforeAll(async () => {
    MongoMemory.connect();

    {
      // create non-admin user and log in
      await createUser(user);
      const response = await request(app).post('/login').send({email: user.email, password: user.password}).expect('Content-Type', /json/).expect(httpStatus.OK);
      const cookies = extractCookies(response.headers);
      const sessionCookie = cookies[config.session.name];
      expect(sessionCookie).toBeTruthy();
      cookie.user = `${config.session.name}=${sessionCookie?.value}`;
    }

    {
      // add location
      const locationDocument = await locationService.add(location);
      expect(locationDocument.id).toBeTruthy();
      location.id = wsDesk.location = wsCoworking.location = wsUnavailable.location = reservation.location = locationDocument.id;
    }

    {
      // add workspace: Desk, available
      const workspaceDocument = await workspaceService.add(wsDesk);
      expect(workspaceDocument.id).toBeTruthy();
    }

    {
      // add workspace: Coworking. Book it for 1 hour
      const workspaceDocument = await workspaceService.add(wsCoworking);
      expect(workspaceDocument.id).toBeTruthy();

      reservation.workspace = workspaceDocument.id;
      const reservationDocument = await reservationService.add(reservation);
      expect(reservationDocument.id).toBeTruthy();
      reservation.id = reservationDocument.id;
    }

    {
      // add workspace: on maintenance (unavaalble)
      const workspaceDocument = await workspaceService.add(wsUnavailable);
      expect(workspaceDocument.id).toBeTruthy();
    }
  });

  it('returns workspaces available in location', async () => {
    const criteria = {location: location.id, from: IN_2_HOURS, to: IN_3_HOURS};
    const response = await request(app).post('/findWorkspaces').set('Cookie', cookie.user).send(criteria).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  it('does not return workspace reserved at time in location', async () => {
    const criteria = {location: location.id, from: IN_1_HOUR, to: IN_3_HOURS};
    const response = await request(app).post('/findWorkspaces').set('Cookie', cookie.user).send(criteria).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it('allows to exclude booked reservation to support edit', async () => {
    const criteria = {location: location.id, from: IN_1_HOUR, to: IN_3_HOURS, excludeReservation: reservation.id};
    const response = await request(app).post('/findWorkspaces').set('Cookie', cookie.user).send(criteria).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  it('filters workspaces by type', async () => {
    const criteria = {location: location.id, from: IN_2_HOURS, to: IN_3_HOURS, type: wsDesk.type};
    const response = await request(app).post('/findWorkspaces').set('Cookie', cookie.user).send(criteria).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it('filters workspaces by size', async () => {
    const criteria = {location: location.id, from: IN_2_HOURS, to: IN_3_HOURS, size: wsCoworking.size};
    const response = await request(app).post('/findWorkspaces').set('Cookie', cookie.user).send(criteria).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it('filtes workspaces by equipment', async () => {
    const criteria = {location: location.id, from: IN_2_HOURS, to: IN_3_HOURS, equipment: [Equipment.COUCH]};
    const response = await request(app).post('/findWorkspaces').set('Cookie', cookie.user).send(criteria).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it('filtes workspaces by description', async () => {
    const criteria = {location: location.id, from: IN_2_HOURS, to: IN_3_HOURS, description: '_1'};
    const response = await request(app).post('/findWorkspaces').set('Cookie', cookie.user).send(criteria).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it('returns empty array if nothing is found', async () => {
    const criteria = {location: 'fakeLocation', from: IN_1_HOUR, to: IN_3_HOURS};
    const responseFakeLoc = await request(app).post('/findWorkspaces').set('Cookie', cookie.user).send(criteria).expect(httpStatus.OK);
    expect(Array.isArray(responseFakeLoc.body)).toBe(true);
    expect(responseFakeLoc.body.length).toBe(0);
  });

  it('is not allowed for unauthorized user', async () => {
    const criteria = {location: location.id, from: IN_2_HOURS, to: IN_3_HOURS};
    await request(app).post('/findWorkspaces').send({criteria}).expect(httpStatus.BAD_REQUEST);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
