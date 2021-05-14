import request from 'supertest';
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

  it('hides error stack', async () => {
    const response = await request(app).get('/users');
    expect(response.body.stack).toBe(false);
  });

  it('secures session cookie', async () => {
    const response = await request(app).post('/users').send(validUserData);
    const cookies = extractCookies(response.headers);
    const sessionCookie = cookies[config.session.name];
    expect(sessionCookie).toBeTruthy();
    expect(sessionCookie.flags.HttpOnly).toEqual(true);
    expect(sessionCookie.flags.SameSite).toEqual('Strict');
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
