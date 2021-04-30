import request from "supertest";
import httpStatus from "http-status";
import App from "../../src/App";
import {MongoMemory} from "../utils";
import {createUser} from "../../src/services/user";
import {UserRole} from "../../src/types";

const app = new App().getApp();
let cookie: string = "";

const user = {email: "test@reg.com", firstName: "John", lastName: "Doe", password: "Secret123", passwordRepeat: "Secret123", role: UserRole.USER};
const loginData = {email: user.email, password: user.password};

describe("Reset password service", () => {
  beforeAll(async () => {
    MongoMemory.connect();
    await createUser(user);
    await request(app).post("/login").send(loginData).expect(httpStatus.OK);
  });

  it("changes password to temporal for existing user", async () => {
    await request(app).post("/forgotPassword").send({email: user.email}).expect(httpStatus.OK);
    await request(app).post("/login").send(loginData).expect(httpStatus.UNAUTHORIZED);
  });

  it("returns ok without changes for unexisting user", async () => {
    await request(app).post("/forgotPassword").send({email: "test.t@unex.com"}).expect(httpStatus.OK);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
