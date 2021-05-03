import request from 'supertest';
import httpStatus from 'http-status';
import App from '../../src/App';
import config from '../../src/config';
import {MongoMemory, extractCookies} from '../utils';

const app = new App().getApp();
let cookie = '';

const user = {
  register: {email: 'test@reg.com', firstName: 'John', lastName: 'Doe', password: 'Secret123', passwordRepeat: 'Secret123'},
  valid: {email: 'test@reg.com', firstName: 'Johnny', lastName: 'Dowson', password: 'Secret123'},
  wrongPasword: {email: 'test@reg.com', firstName: 'Johnny', lastName: 'Dowson', password: 'Secret1234'}
};

describe('User update service', () => {
  beforeAll(async () => {
    MongoMemory.connect();

    // register new user
    const response = await request(app).post('/register').send(user.register).expect('Content-Type', /json/).expect(httpStatus.CREATED);
    const cookies = extractCookies(response.headers);
    const sessionCookie = cookies[config.session.name];
    expect(sessionCookie).toBeTruthy();
    cookie = `${config.session.name}=${sessionCookie?.value}`;
  });

  it('is able to update user if data is valid', async () => {
    const response = await request(app).post('/updateUser').set('Cookie', cookie).send(user.valid).expect(httpStatus.OK);
    expect(response.body.email).toBe(user.valid.email);
    expect(response.body.firstName).toBe(user.valid.firstName);
    expect(response.body.lastName).toBe(user.valid.lastName);
  });

  it('fails if password is not correct', async () => {
    await request(app).post('/updateUser').set('Cookie', cookie).send(user.wrongPasword).expect(httpStatus.UNAUTHORIZED);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
