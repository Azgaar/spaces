import request from 'supertest';
import httpStatus from 'http-status';
import App from '../../src/App';
import config from '../../src/config';
import {MongoMemory, extractCookies} from '../utils';

const app = new App().getApp();

const validUserData = {email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: 'Secret123', passwordRepeat: 'Secret123'};

// Jest sets config.env to 'test' that acts as 'production' in @errors.ts
describe('Server', () => {
  beforeAll(async () => {
    MongoMemory.connect();
  });

  it('returns 500 on GET request', async () => {
    await request(app).get('/').expect('Content-Type', /json/).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it('hides error stack', async () => {
    const response = await request(app).post('/getUsers');
    expect(response.body.stack).toBe(false);
  });

  it('secures session cookie', async () => {
    const response = await request(app).post('/users').send(validUserData);
    const cookies = extractCookies(response.headers);
    const sessionCookie = cookies[config.session.name];
    expect(sessionCookie).toBeTruthy();
    expect(sessionCookie.flags.HttpOnly).toEqual(true);
    expect(sessionCookie.flags.SameSite).toEqual(true);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
