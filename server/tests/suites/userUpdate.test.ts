import request from 'supertest';
import httpStatus from 'http-status';
import App from '../../src/App';
import config from '../../src/config';
import {MongoMemory, extractCookies} from '../utils';
import {createUser} from '../../src/services/user';
import {UserData, UserRole} from '../../src/types';

const app = new App().getApp();
let cookie = '';

const user: UserData = {email: 'user@reg.com', firstName: 'Jane', lastName: 'Dowson', password: 'Secret123', role: UserRole.USER};
const validUpdate = {email: 'updated_user@reg.com', firstName: 'Johnny', lastName: 'Low', password: 'Secret123'};
const wrongPasword = {email: 'user@reg.com', firstName: 'Jane', lastName: 'Dowson', password: 'SecretWrong'};
const noPasword = {email: 'user@reg.com', firstName: 'Jane', lastName: 'Dowson'};

describe('User update service', () => {
  beforeAll(async () => {
    MongoMemory.connect();

    // create non-admin user and log in
    const createdUser = await createUser(user);
    user.id = createdUser.id;
    const response = await request(app).post('/login').send({email: user.email, password: user.password}).expect('Content-Type', /json/).expect(httpStatus.OK);
    const cookies = extractCookies(response.headers);
    const sessionCookie = cookies[config.session.name];
    expect(sessionCookie).toBeTruthy();
    cookie = `${config.session.name}=${sessionCookie?.value}`;
  });

  it('is able to update user with valid data', async () => {
    const response = await request(app)
      .patch('/users/' + user.id)
      .set('Cookie', cookie)
      .send(validUpdate)
      .expect(httpStatus.OK);
    expect(response.body.id).toBe(user.id);
    expect(response.body.email).toBe(validUpdate.email);
    expect(response.body.firstName).toBe(validUpdate.firstName);
    expect(response.body.lastName).toBe(validUpdate.lastName);
  });

  it('fails if password is not correct', async () => {
    await request(app)
      .patch('/users/' + user.id)
      .set('Cookie', cookie)
      .send(wrongPasword)
      .expect(httpStatus.UNAUTHORIZED);
  });

  it('fails if password is not provided', async () => {
    await request(app)
      .patch('/users/' + user.id)
      .set('Cookie', cookie)
      .send(noPasword)
      .expect(httpStatus.BAD_REQUEST);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
