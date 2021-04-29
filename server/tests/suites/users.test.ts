import request from "supertest";
import httpStatus from "http-status";
import App from "../../src/App";
import config from "../../src/config";
import {MongoMemory, extractCookies} from "../utils";
import {UserData, UserRole} from "../../src/types";
import {createUser} from "../../src/services/user";

const app = new App().getApp();
let cookie = {admin: "", user: ""};

const admin: UserData = {email: "admin@reg.com", firstName: "John", lastName: "Doe", password: "Secret12", role: UserRole.ADMIN};
const user: UserData = {email: "user@reg.com", firstName: "Jane", lastName: "Dowson", password: "Secret1234", role: UserRole.USER};
const user2: UserData = {email: "user2@reg.com", firstName: "Frank", lastName: "Dawn", password: "Secret12345", role: UserRole.USER};
const user3: UserData = {email: "user3@reg.com", firstName: "Peter", lastName: "Low", password: "Secret123456", role: UserRole.USER};

describe("Users management service", () => {
  beforeAll(async () => {
    MongoMemory.connect();

    {
      // create admin user and log in
      await createUser(admin);
      const response = await request(app).post("/login").send({email: admin.email, password: admin.password}).expect("Content-Type", /json/).expect(httpStatus.OK);
      const cookies = extractCookies(response.headers);
      const sessionCookie = cookies[config.session.name];
      expect(sessionCookie).toBeTruthy();
      cookie.admin = `${config.session.name}=${sessionCookie?.value}`;
    }

    {
      // create non-admin user and log in
      await createUser(user);
      const response = await request(app).post("/login").send({email: user.email, password: user.password}).expect("Content-Type", /json/).expect(httpStatus.OK);
      const cookies = extractCookies(response.headers);
      const sessionCookie = cookies[config.session.name];
      expect(sessionCookie).toBeTruthy();
      cookie.user = `${config.session.name}=${sessionCookie?.value}`;

      // create additional non-admin users
      await createUser(user2);
      await createUser(user3);
    }
  });

  it("returns all non-admin users for admin", async () => {
    const response = await request(app).post("/getUsers").set("Cookie", cookie.admin).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);
    expect(response.body[0].email).toBe(user.email);
    expect(response.body[0].firstName).toBe(user.firstName);
    expect(response.body[0].lastName).toBe(user.lastName);
  });

  it("allows to delete single user", async () => {
    const response = await request(app).delete("/deleteUsers").set("Cookie", cookie.admin).send([user3.email]).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);
  });

  it("allows to delete multiple users", async () => {
    const response = await request(app).delete("/deleteUsers").set("Cookie", cookie.admin).send([admin.email, user2.email]).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it("is not allowed for unauthorized user", async () => {
    await request(app).post("/getUsers").expect(httpStatus.BAD_REQUEST);
  });

  it("is not allowed for non-admin", async () => {
    await request(app).post("/getUsers").set("Cookie", cookie.user).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
