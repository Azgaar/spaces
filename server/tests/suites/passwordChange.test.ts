import request from 'supertest';
import httpStatus from 'http-status';
import App from '../../src/App';
import config from '../../src/config';
import {MongoMemory, extractCookies} from '../utils';
import {UserData, UserRole} from '../../src/types';
import {createUser} from '../../src/services/user';

const app = new App().getApp();
let cookie = '';

const user: UserData = {email: 'user@reg.com', firstName: 'Jane', lastName: 'Dowson', password: 'Secret123', role: UserRole.USER};
const passwordUpdate = {password: 'Secret123', passwordNew: 'Secret123new', passwordNewRepeat: 'Secret123new'};
const incorrectNoPass = {passwordNew: 'Secret123newNew', passwordNewRepeat: 'Secret123newNew'};
const incorrectRepeat = {password: 'Secret123new', passwordNew: 'Secret123newNew', passwordNewRepeat: 'Secret123new'};
const incorrectNoRepeat = {password: 'Secret123new', passwordNew: 'Secret123newNew'};

describe('Password change service', () => {
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

  it('is able to change password if data is valid', async () => {
    const response = await request(app)
      .patch('/users/' + user.id)
      .set('Cookie', cookie)
      .send(passwordUpdate)
      .expect(httpStatus.OK);
    expect(response.body.id).toBe(user.id);

    await request(app).post('/login').send({email: user.email, password: passwordUpdate.passwordNew}).expect('Content-Type', /json/).expect(httpStatus.OK);
    await request(app).post('/login').send({email: user.email, password: passwordUpdate.password}).expect('Content-Type', /json/).expect(httpStatus.UNAUTHORIZED);
  });

  it('fails if password is now longer valid', async () => {
    await request(app)
      .patch('/users/' + user.id)
      .set('Cookie', cookie)
      .send(passwordUpdate)
      .expect(httpStatus.UNAUTHORIZED);
  });

  it('fails if current password is not provided', async () => {
    await request(app)
      .patch('/users/' + user.id)
      .set('Cookie', cookie)
      .send(incorrectNoPass)
      .expect(httpStatus.BAD_REQUEST);
  });

  it('fails if password repeat is not matching', async () => {
    await request(app)
      .patch('/users/' + user.id)
      .set('Cookie', cookie)
      .send(incorrectRepeat)
      .expect(httpStatus.BAD_REQUEST);
  });

  it('fails if password repeat is not provided', async () => {
    await request(app)
      .patch('/users/' + user.id)
      .set('Cookie', cookie)
      .send(incorrectNoRepeat)
      .expect(httpStatus.BAD_REQUEST);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
