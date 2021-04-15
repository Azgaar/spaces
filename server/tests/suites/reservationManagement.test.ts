import request from "supertest";
import httpStatus from "http-status";
import App from "../../src/App";
import config from "../../src/config";
import {MongoMemory, extractCookies} from "../utils";
import {UserData, UserRole, WorkspaceData, WorkspaceStatus, WorkspaceType, LocationData, ReservationData, ReservationStatus} from "../../src/types";
import {createUser} from "../../src/services/user";
import locationService from "../../src/services/location";
import workspaceService from "../../src/services/workspace";
import {getMaxDate} from "../../src/validation/reservation";

const app = new App().getApp();
let cookie = {admin: "", user: ""};

// test dates
const MINUTE = 1000 * 60;
const HOUR: number = MINUTE * 60;

const PAST: Date = new Date(); // will be past on test
const IN_1_HOUR: Date = new Date(PAST.getTime() + HOUR);
const IN_2_HOURS: Date = new Date(PAST.getTime() + HOUR * 2);
const MAX_DAY: Date = new Date(getMaxDate());
const PAST_MAX_DAY: Date = new Date(new Date(getMaxDate()).getTime() + HOUR * 48);

console.log({PAST, IN_1_HOUR, IN_2_HOURS, MAX_DAY, PAST_MAX_DAY});

const admin: UserData = {email: "admin@reg.com", firstName: "John", lastName: "Doe", password: "Secret12", role: UserRole.ADMIN};
const user: UserData = {email: "user@reg.com", firstName: "Jane", lastName: "Dowson", password: "Secret1234", role: UserRole.USER};
const location: LocationData = {description: "testLoc1"};
const workspace: WorkspaceData = {description: "WS_1", location: "", status: WorkspaceStatus.AVAILABLE, type: WorkspaceType.DESK, size: 1, equipment: []};
const reservation: ReservationData = {location: "", workspace: "", requester: user.email, from: IN_1_HOUR, to: IN_2_HOURS};

describe("Reservation management service", () => {
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
      location.id = workspace.location = reservation.location = locationDocument.id;
    }

    {
      // add workspace
      const workspaceDocument = await workspaceService.add(workspace);
      expect(workspaceDocument.id).toBeTruthy();
      workspace.id = reservation.workspace = workspaceDocument.id;
    }
  });

  it("allows to add reservation for admin", async () => {
    const response = await request(app).post("/addReservation").set("Cookie", cookie.admin).send(reservation).expect(httpStatus.CREATED);
    expect(response.body.id).toBeTruthy();
    expect(response.body.location).toBe(reservation.location);
    expect(response.body.workspace).toBe(reservation.workspace);
    expect(response.body.description).toBe(workspace.description);
    expect(response.body.type).toBe(workspace.type);
    expect(response.body.size).toBe(workspace.size);
    expect(response.body.status).toBe(ReservationStatus.FUTURE);
    expect(response.body.from).toBe(reservation.from.toISOString());
    expect(response.body.to).toBe(reservation.to.toISOString());
  });

  it("allows to get reservation list for admin", async () => {
    const response = await request(app).post("/getReservations").set("Cookie", cookie.admin).send({location: workspace.location}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe(workspace.description);
    expect(response.body[0].status).toBe(ReservationStatus.FUTURE);
    expect(response.body[0].id).toBeTruthy();
  });

  it("allows to update reservation for admin", async () => {
    const description = "renameWorkspace";
    const response = await request(app).post("/updateReservation").set("Cookie", cookie.admin).send({...workspace, description}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe(description);
    expect(response.body[0].location).toBe(workspace.location);
    expect(response.body[0].status).toBe(workspace.status);
    expect(response.body[0].type).toBe(workspace.type);
    expect(response.body[0].size).toBe(workspace.size);
    expect(Array.isArray(response.body[0].equipment)).toBe(true);
    expect(response.body[0].equipment.length).toBe(0);
  });

  it("fails to update reservation to incorrect status", async () => {
    const status = "unknown";
    await request(app).post("/updateReservation").set("Cookie", cookie.admin).send({...workspace, status}).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it("fails to update reservation to incorrect type", async () => {
    const type = "unknownType";
    await request(app).post("/updateReservation").set("Cookie", cookie.admin).send({...workspace, type}).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it("allows to delete reservation for admin", async () => {
    const data = {location: workspace.location, selection: [workspace.id]};
    const response = await request(app).delete("/deleteReservations").set("Cookie", cookie.admin).send(data).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it("allows user to add reservation", async () => {
    const response = await request(app).post("/addReservation").set("Cookie", cookie.user).send(reservation).expect(httpStatus.CREATED);
    expect(response.body.description).toBe(workspace.description);
    expect(response.body.location).toBe(workspace.location);
    expect(response.body.status).toBe(workspace.status);
    expect(response.body.type).toBe(workspace.type);
    expect(response.body.size).toBe(workspace.size);
    expect(Array.isArray(response.body.equipment)).toBe(true);
    expect(response.body.equipment.length).toBe(0);
  });

  it("allows user to list his reservations", async () => {
    const response = await request(app).post("/getReservations").set("Cookie", cookie.user).send({location: workspace.location}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe(workspace.description);
    expect(response.body[0].id).toBeTruthy();
    workspace.id = response.body[0].id;
  });

  it("allows user to delete his reservations", async () => {
    const data = {location: workspace.location, selection: [workspace.id]};
    const response = await request(app).delete("/deleteReservations").set("Cookie", cookie.user).send(data).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it("not allows to list all reservations for non-admin", async () => {
    await request(app).post("/getReservations").set("Cookie", cookie.user).send({location: workspace.location}).expect(httpStatus.INTERNAL_SERVER_ERROR);
    await request(app).post("/updateReservation").set("Cookie", cookie.user).send(workspace).expect(httpStatus.INTERNAL_SERVER_ERROR);
    await request(app).delete("/deleteReservations").set("Cookie", cookie.user).send({location: workspace.location, selection: [workspace.id]}).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it("is not allowed for unauthorized user", async () => {
    await request(app).post("/addReservation").send(workspace).expect(httpStatus.BAD_REQUEST);
    await request(app).post("/getReservations").send({location: workspace.location}).expect(httpStatus.BAD_REQUEST);
    await request(app).post("/updateReservation").send(workspace).expect(httpStatus.BAD_REQUEST);
    await request(app).delete("/deleteReservations").send({location: workspace.location, selection: [workspace.id]}).expect(httpStatus.BAD_REQUEST);
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
