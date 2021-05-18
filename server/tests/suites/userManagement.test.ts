import request from 'supertest';
import httpStatus from 'http-status';
import App from '../../src/App';
import config from '../../src/config';
import {MongoMemory, extractCookies} from '../utils';
import {UserData, UserRole} from '../../src/types';
import {createUser} from '../../src/services/user';

const app = new App().getApp();
const cookie = {admin: '', user: ''};

const admin: UserData = {email: 'admin@reg.com', firstName: 'John', lastName: 'Doe', password: 'Secret12', role: UserRole.ADMIN};
const user: UserData = {email: 'user@reg.com', firstName: 'Jane', lastName: 'Dowson', password: 'Secret1234', role: UserRole.USER};

describe('Users management service', () => {
  beforeAll(async () => {
    MongoMemory.connect();

    {
      // create admin user and log in
      const createdUser = await createUser(admin);
      admin.id = createdUser.id;
      const response = await request(app).post('/login').send({email: admin.email, password: admin.password}).expect('Content-Type', /json/).expect(httpStatus.OK);
      const cookies = extractCookies(response.headers);
      const sessionCookie = cookies[config.session.name];
      expect(sessionCookie).toBeTruthy();
      cookie.admin = `${config.session.name}=${sessionCookie?.value}`;
    }

    {
      // create non-admin user and log in
      const createdUser = await createUser(user);
      user.id = createdUser.id;
      const response = await request(app).post('/login').send({email: user.email, password: user.password}).expect('Content-Type', /json/).expect(httpStatus.OK);
      const cookies = extractCookies(response.headers);
      const sessionCookie = cookies[config.session.name];
      expect(sessionCookie).toBeTruthy();
      cookie.user = `${config.session.name}=${sessionCookie?.value}`;
    }
  });

  it('allows to get list of users', async () => {
    const response = await request(app).get('/users').set('Cookie', cookie.admin).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  it('allows to change role to admin', async () => {
    const role = UserRole.ADMIN;
    const response = await request(app)
      .patch('/users/' + user.id)
      .set('Cookie', cookie.admin)
      .send({role})
      .expect(httpStatus.OK);
    expect(response.body.id).toBe(user.id);
    expect(response.body.role).toBe(role);
  });

  it('allows to change role to user', async () => {
    const role = UserRole.USER;
    const response = await request(app)
      .patch('/users/' + user.id)
      .set('Cookie', cookie.admin)
      .send({role})
      .expect(httpStatus.OK);
    expect(response.body.id).toBe(user.id);
    expect(response.body.role).toBe(role);
  });

  it('fails if role is not correct', async () => {
    await request(app)
      .patch('/users/' + user.id)
      .set('Cookie', cookie.admin)
      .send({role: 'Test'})
      .expect(httpStatus.BAD_REQUEST);
  });

  it('fails to update user with incorrect id', async () => {
    await request(app).patch('/users/testId').set('Cookie', cookie.admin).send({role: UserRole.ADMIN}).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it('allows to delete single user', async () => {
    const response = await request(app)
      .delete('/users/' + user.id)
      .set('Cookie', cookie.admin)
      .expect(httpStatus.OK);
    expect(response.body.id).toBe(user.id);

    const users = await request(app).get('/users').set('Cookie', cookie.admin).expect(httpStatus.OK);
    expect(users.body.length).toBe(1);
  });

  it('fails to delete user with incorrect id', async () => {
    await request(app).delete('/users/testID').set('Cookie', cookie.admin).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it('is not allowed for unauthorized user', async () => {
    await request(app).get('/users').expect(httpStatus.BAD_REQUEST);
    await request(app)
      .patch('/users/' + admin.id)
      .send({role: UserRole.USER})
      .expect(httpStatus.BAD_REQUEST);
    await request(app)
      .delete('/users/' + admin.id)
      .expect(httpStatus.BAD_REQUEST);
  });

  it('is not allowed for non-admin', async () => {
    await request(app).get('/users').set('Cookie', cookie.user).expect(httpStatus.INTERNAL_SERVER_ERROR);
    await request(app)
      .patch('/users/' + admin.id)
      .set('Cookie', cookie.user)
      .send({role: UserRole.USER})
      .expect(httpStatus.INTERNAL_SERVER_ERROR);
    await request(app)
      .delete('/users/' + admin.id)
      .set('Cookie', cookie.user)
      .expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
