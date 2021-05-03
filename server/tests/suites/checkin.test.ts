import request from 'supertest';
import httpStatus from 'http-status';
import App from '../../src/App';
import config from '../../src/config';
import {MongoMemory, extractCookies} from '../utils';
import {UserRole} from '../../src/types';

const app = new App().getApp();
let cookie = '';

const user = {email: 'test@reg.com', firstName: 'John', lastName: 'Doe', password: 'Secret123', passwordRepeat: 'Secret123'};

describe('Check-in service', () => {
  beforeAll(async () => {
    MongoMemory.connect();

    // register new user
    const response = await request(app).post('/register').send(user).expect('Content-Type', /json/).expect(httpStatus.CREATED);
    const cookies = extractCookies(response.headers);
    const sessionCookie = cookies[config.session.name];
    expect(sessionCookie).toBeTruthy();
    cookie = `${config.session.name}=${sessionCookie?.value}`;
  });

  it('returns data for logged in user', async () => {
    const response = await request(app).post('/checkin').set('Cookie', cookie).expect(httpStatus.OK);
    expect(response.body.email).toBe(user.email);
    expect(response.body.firstName).toBe(user.firstName);
    expect(response.body.lastName).toBe(user.lastName);
    expect(response.body.role).toBe(UserRole.USER);
  });

  it('does not return data if no session', async () => {
    const response = await request(app).post('/checkin').expect(httpStatus.NO_CONTENT);
    expect(response.body).toEqual({});
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
