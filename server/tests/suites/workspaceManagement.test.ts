import request from "supertest";
import httpStatus from "http-status";
import App from "../../src/App";
import config from "../../src/config";
import {MongoMemory, extractCookies} from "../utils";
import {UserData, UserRole, WorkspaceData, WorkspaceStatus, WorkspaceType, LocationData, Equipment} from "../../src/types";
import {createUser} from "../../src/services/user";
import locationService from "../../src/services/location";

const app = new App().getApp();
let cookie = {admin: "", user: ""};

const admin: UserData = {email: "admin@reg.com", firstName: "John", lastName: "Doe", password: "Secret12", role: UserRole.ADMIN};
const user: UserData = {email: "user@reg.com", firstName: "Jane", lastName: "Dowson", password: "Secret1234", role: UserRole.USER};
const location: LocationData = {description: "testLoc1"};
const workspace: WorkspaceData = {description: "WS_1", location: "", status: WorkspaceStatus.AVAILABLE, type: WorkspaceType.DESK, size: 1, equipment: [Equipment.HEADSET]};

describe("Workspace management service", () => {
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

    {
      // add location
      const locationDocument = await locationService.add(location);
      expect(locationDocument.id).toBeTruthy();
      location.id = workspace.location = locationDocument.id;
    }
  });

  it("allows to add workspace for admin", async () => {
    const response = await request(app).post("/addWorkspace").set("Cookie", cookie.admin).send(workspace).expect(httpStatus.CREATED);
    expect(response.body.description).toBe(workspace.description);
    expect(response.body.location).toBe(workspace.location);
    expect(response.body.status).toBe(workspace.status);
    expect(response.body.type).toBe(workspace.type);
    expect(response.body.size).toBe(workspace.size);
    expect(Array.isArray(response.body.equipment)).toBe(true);
    expect(response.body.equipment.length).toBe(0);
  });

  it("allows to get workspace list for admin", async () => {
    const response = await request(app).post("/getWorkspaces").set("Cookie", cookie.admin).send({location: workspace.location}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe(workspace.description);
    expect(response.body[0].id).toBeTruthy();
    workspace.id = response.body[0].id;
  });

  it("allows to update workspace for admin", async () => {
    const status = WorkspaceStatus.UNAVAILABLE;
    const response = await request(app).post("/updateWorkspace").set("Cookie", cookie.admin).send({...workspace, status}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe(workspace.description);
    expect(response.body[0].status).toBe(status);
  });

  it("fails to update unknown workspace", async () => {
    await request(app).post("/updateWorkspace").set("Cookie", cookie.admin).send({...workspace, id: "606f1d6eb20d7e35e0360000"}).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it("fails to update workspace to incorrect status", async () => {
    const status = "unknown";
    await request(app).post("/updateWorkspace").set("Cookie", cookie.admin).send({...workspace, status}).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it("fails to update workspace to incorrect type", async () => {
    const type = "unknownType";
    await request(app).post("/updateWorkspace").set("Cookie", cookie.admin).send({...workspace, type}).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it("allows to delete workspace for admin", async () => {
    const data = {location: workspace.location, selection: [workspace.id]};
    const response = await request(app).delete("/deleteWorkspaces").set("Cookie", cookie.admin).send(data).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it("is not allowed for non-admin", async () => {
    await request(app).post("/addWorkspace").set("Cookie", cookie.user).send(workspace).expect(httpStatus.INTERNAL_SERVER_ERROR);
    await request(app).post("/getWorkspaces").set("Cookie", cookie.user).send({location: workspace.location}).expect(httpStatus.INTERNAL_SERVER_ERROR);
    await request(app).post("/updateWorkspace").set("Cookie", cookie.user).send(workspace).expect(httpStatus.INTERNAL_SERVER_ERROR);
    await request(app).delete("/deleteWorkspaces").set("Cookie", cookie.user).send({location: workspace.location, selection: [workspace.id]}).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it("is not allowed for unauthorized user", async () => {
    await request(app).post("/addWorkspace").send(workspace).expect(httpStatus.BAD_REQUEST);
    await request(app).post("/getWorkspaces").send({location: workspace.location}).expect(httpStatus.BAD_REQUEST);
    await request(app).post("/updateWorkspace").send(workspace).expect(httpStatus.BAD_REQUEST);
    await request(app).delete("/deleteWorkspaces").send({location: workspace.location, selection: [workspace.id]}).expect(httpStatus.BAD_REQUEST);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
