import request from "supertest";
import httpStatus from "http-status";
import App from "../../src/App";
import config from "../../src/config";
import {MongoMemory, extractCookies} from "../utils";
import {LocationData, UserData, UserRole} from "../../src/types";
import {createUser} from "../../src/services/user";

const app = new App().getApp();
let cookie = {admin: "", user: ""};

const admin: UserData = {email: "admin@reg.com", firstName: "John", lastName: "Doe", password: "Secret12", role: UserRole.ADMIN};
const user: UserData = {email: "user@reg.com", firstName: "Jane", lastName: "Dowson", password: "Secret1234", role: UserRole.USER};
const location: LocationData = {description: "testLoc1"};

describe("Location management service", () => {
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
    }
  });

  it("allows to add location for admin", async () => {
    const response = await request(app).post("/addLocation").set("Cookie", cookie.admin).send(location).expect(httpStatus.CREATED);
    expect(response.body.description).toBe(location.description);
    expect(response.body.id).toBeTruthy();
  });

  it("allows to get locations list for admin", async () => {
    const response = await request(app).post("/getLocations").set("Cookie", cookie.admin).send({onlyWithWorkspaces: false}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe(location.description);
    expect(response.body[0].id).toBeTruthy();
    location.id = response.body[0].id;
  });

  it("allows to get locations list for user", async () => {
    const response = await request(app).post("/getLocations").set("Cookie", cookie.user).send({onlyWithWorkspaces: false}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it("allows to rename location for admin", async () => {
    const description = "renameLocation";
    const response = await request(app).post("/renameLocation").set("Cookie", cookie.admin).send({id: location.id, description}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe(description);
    expect(response.body[0].id).toBe(location.id);
  });

  it("allows to delete location for admin", async () => {
    const response = await request(app).delete("/deleteLocation").set("Cookie", cookie.admin).send({id: location.id}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it("is not allowed for unauthorized user", async () => {
    await request(app).post("/addLocation").send({description: location.description}).expect(httpStatus.BAD_REQUEST);
    await request(app).post("/getLocations").expect(httpStatus.BAD_REQUEST);
    await request(app).post("/renameLocation").send(location).expect(httpStatus.BAD_REQUEST);
    await request(app).delete("/deleteLocation").send({id: location.id}).expect(httpStatus.BAD_REQUEST);
  });

  it("is not allowed for non-admin", async () => {
    await request(app).post("/addLocation").set("Cookie", cookie.user).send({description: location.description}).expect(httpStatus.INTERNAL_SERVER_ERROR);
    await request(app).post("/renameLocation").set("Cookie", cookie.user).send(location).expect(httpStatus.INTERNAL_SERVER_ERROR);
    await request(app).delete("/deleteLocation").set("Cookie", cookie.user).send({id: location.id}).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
