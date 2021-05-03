import request from 'supertest';
import httpStatus from 'http-status';
import App from '../../src/App';
import config from '../../src/config';
import {MongoMemory, extractCookies} from '../utils';

const app = new App().getApp();
let cookie = '';

const user = {
  register: {email: 'test@reg.com', firstName: 'John', lastName: 'Doe', password: 'Secret123', passwordRepeat: 'Secret123'},
  change: {password: 'Secret123', passwordNew: 'Secret1234', passwordNewRepeat: 'Secret1234'}
};

describe('Password change service', () => {
  beforeAll(async () => {
    MongoMemory.connect();

    // register new user
    const response = await request(app).post('/register').send(user.register).expect('Content-Type', /json/).expect(httpStatus.CREATED);
    const cookies = extractCookies(response.headers);
    const sessionCookie = cookies[config.session.name];
    expect(sessionCookie).toBeTruthy();
    cookie = `${config.session.name}=${sessionCookie?.value}`;
  });

  it('is able to change password if data is valid', async () => {
    await request(app).post('/changePassword').set('Cookie', cookie).send(user.change).expect(httpStatus.OK);
  });

  it('fails if current password is not correct', async () => {
    await request(app).post('/changePassword').set('Cookie', cookie).send(user.change).expect(httpStatus.UNAUTHORIZED);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
