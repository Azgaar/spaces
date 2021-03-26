import request from "supertest";
import httpStatus from "http-status";
import App from "../../src/App";
import config from "../../src/config";
import {MongoMemory, extractCookies} from "../utils";

const app = new App().getApp();
let cookie: string = "";

const users = {
  register: {email: "test@reg.com", firstName: "John", lastName: "Doe", password: "Secret123", passwordRepeat: "Secret123"},
  correctCredentials: {email: "test@reg.com", password: "Secret123"},
  wrongEmail: {email: "testUnknown@reg.com", password: "Secret123"},
  wrongPassword: {email: "test@reg.com", password: "Secret1234"}
}

describe("Login service", () => {
  beforeAll(async () => {
    MongoMemory.connect();

    // register new user
    await request(app).post("/register").send(users.register);
  });

  it("fails to login with incorrect email", async () => {
    await request(app).post("/login")
      .send(users.wrongEmail)
      .expect("Content-Type", /json/)
      .expect(httpStatus.UNAUTHORIZED);
  });

  it("fails to login with incorrect password", async () => {
    await request(app).post("/login")
      .send(users.wrongPassword)
      .expect("Content-Type", /json/)
      .expect(httpStatus.UNAUTHORIZED);
  });

  it("allows to login with correct credentials and sets session cookies", async () => {
    const response = await request(app).post("/login")
      .send(users.correctCredentials)
      .expect("Content-Type", /json/)
      .expect(httpStatus.OK);
    expect(response.body.email).toBe(users.correctCredentials.email);

    const cookies = extractCookies(response.headers);
    const sessionCookie = cookies[config.session.name];
    expect(sessionCookie).toBeTruthy();
    cookie = `${config.session.name}=${sessionCookie?.value}`;
  });

  it("fails to login user that is already logged in", async () => {
    await request(app).post("/login")
      .set("Cookie", cookie)
      .send(users.correctCredentials)
      .expect("Content-Type", /json/)
      .expect(httpStatus.BAD_REQUEST);
  });

  it("allows to logout if user is logged in", async () => {
    const response = await request(app).post("/logout")
      .set("Cookie", cookie)
      .expect("Content-Type", /json/)
      .expect(httpStatus.OK);
    expect(response.body.message).toBe("OK");
  });

  it("fails to logout if user is not logged in", async () => {
    await request(app).post("/logout")
      .send(users.correctCredentials)
      .expect("Content-Type", /json/)
      .expect(httpStatus.BAD_REQUEST);
  });

  it("allows to re-login after logout", async () => {
    const response = await request(app).post("/login")
      .send(users.correctCredentials)
      .expect("Content-Type", /json/)
      .expect(httpStatus.OK);
    expect(response.body.email).toBe(users.correctCredentials.email);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
