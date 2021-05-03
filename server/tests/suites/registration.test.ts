import request from 'supertest';
import httpStatus from 'http-status';
import App from '../../src/App';
import config from '../../src/config';
import {MongoMemory, extractCookies} from '../utils';

const app = new App().getApp();

const users = {
  valid: {email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: 'Secret123', passwordRepeat: 'Secret123'},
  missingFields: {email: 'test@test.com'},
  invalidEmail: {email: 'test@test.c', firstName: 'John', lastName: 'Doe', password: 'Secret123', passwordRepeat: 'Secret123'},
  shortPassword: {email: 'test@test.com', firstName: 'John', lastName: 'Doe', password: 'Secret', passwordRepeat: 'Secret'}
};

describe('Registration service', () => {
  beforeAll(() => {
    MongoMemory.connect();
  });

  it('creates user and sets cookie when data is valid', async () => {
    const response = await request(app).post('/register').send(users.valid).expect('Content-Type', /json/).expect(httpStatus.CREATED);
    expect(response.body.email).toBe(users.valid.email);
    expect(response.body.firstName).toBe(users.valid.firstName);
    expect(response.body.lastName).toBe(users.valid.lastName);

    const cookies = extractCookies(response.headers);
    const sessionCookie = cookies[config.session.name];
    expect(sessionCookie).toBeTruthy();
  });

  it('fails creation of user with missing data', async () => {
    const response = await request(app).post('/register').send(users.missingFields).expect('Content-Type', /json/).expect(httpStatus.BAD_REQUEST);
    expect(response.body.message).toContain('is required');
  });

  it('fails creation of user with invalid email', async () => {
    const response = await request(app).post('/register').send(users.invalidEmail).expect('Content-Type', /json/).expect(httpStatus.BAD_REQUEST);
    expect(response.body.message).toBe('`email` must be a valid email');
  });

  it('fails creation of user with too short password', async () => {
    const response = await request(app).post('/register').send(users.shortPassword).expect('Content-Type', /json/).expect(httpStatus.BAD_REQUEST);
    expect(response.body.message).toBe('`password` length must be at least 8 characters long');
  });

  it('fails to create duplicate user', async () => {
    await request(app).post('/register').send(users.valid).expect('Content-Type', /json/).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
