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

const admin: UserData = {email: "admin@reg.com", firstName: "John", lastName: "Doe", password: "Secret12", role: UserRole.ADMIN};
const user: UserData = {email: "user@reg.com", firstName: "Jane", lastName: "Dowson", password: "Secret1234", role: UserRole.USER};
const location: LocationData = {description: "testLoc1"};
const workspace: WorkspaceData = {description: "WS_1", location: "", status: WorkspaceStatus.AVAILABLE, type: WorkspaceType.DESK, size: 1, equipment: []};
const reservation: ReservationData = {location: "", workspace: "", requester: admin.email, from: IN_1_HOUR, to: IN_2_HOURS};
let reservationId: null | string = null;

describe("Reservation service", () => {
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
      reservation.workspace = workspaceDocument.id;
    }
  });

  it("allows to add reservation for admin", async () => {
    const response = await request(app).post("/addReservation").set("Cookie", cookie.admin).send(reservation).expect(httpStatus.CREATED);
    expect(response.body.workspace).toBe(reservation.workspace);
    expect(response.body.requester).toBe(reservation.requester);
    expect(response.body.description).toBe(workspace.description);
    expect(response.body.type).toBe(workspace.type);
    expect(response.body.size).toBe(workspace.size);
    expect(response.body.status).toBe(ReservationStatus.FUTURE);
    expect(response.body.from).toBe(reservation.from.toISOString());
    expect(response.body.to).toBe(reservation.to.toISOString());
    expect(response.body.id).toBeTruthy();
    reservationId = response.body.id;
  });

  it("allows to get reservation list for admin", async () => {
    const response = await request(app).post("/getReservations").set("Cookie", cookie.admin).send({location: workspace.location}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe(workspace.description);
    expect(response.body[0].status).toBe(ReservationStatus.FUTURE);
    expect(response.body[0].id).toBeTruthy();
  });

  it("fails to add concurrent reservation for admin", async () => {
    await request(app).post("/addReservation").set("Cookie", cookie.admin).send(reservation).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it("allows to update reservation to max day for admin", async () => {
    const to = MAX_DAY;
    const response = await request(app).post("/updateReservation").set("Cookie", cookie.admin).send({...reservation, id: reservationId, to}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(reservationId);
    expect(response.body[0].to).toBe(to.toISOString());
  });

  it("fails to update reservation to date in past for admin", async () => {
    const from = PAST;
    await request(app).post("/updateReservation").set("Cookie", cookie.admin).send({...reservation, id: reservationId, from}).expect(httpStatus.BAD_REQUEST);
  });

  it("fails to update reservation to past max day for admin", async () => {
    const to = PAST_MAX_DAY;
    await request(app).post("/updateReservation").set("Cookie", cookie.admin).send({...reservation, id: reservationId, to}).expect(httpStatus.BAD_REQUEST);
  });

  it("allows to delete reservation for admin", async () => {
    const data = {location: workspace.location, selection: [reservationId]};
    const response = await request(app).delete("/deleteReservations").set("Cookie", cookie.admin).send(data).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it("allows to re-add reservation for admin", async () => {
    await request(app).post("/addReservation").set("Cookie", cookie.admin).send(reservation).expect(httpStatus.CREATED);
  });

  it("allows user to add reservation", async () => {
    const resData: ReservationData = {...reservation, requester: user.email, from: IN_2_HOURS, to: MAX_DAY};
    const response = await request(app).post("/addReservation").set("Cookie", cookie.user).send(resData).expect(httpStatus.CREATED);
    expect(response.body.requester).toBe(resData.requester);
    expect(response.body.from).toBe(resData.from.toISOString());
    expect(response.body.to).toBe(resData.to.toISOString());
    expect(response.body.id).toBeTruthy();
    reservationId = response.body.id;
  });

  it("allows user to list only his active reservations", async () => {
    const response = await request(app).post("/getUserReservations").set("Cookie", cookie.user).send({email: user.email, active: true}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].requester).toBe(user.email);
  });

  it("allows user to delete his reservations", async () => {
    const data = {email: user.email, id: reservationId};
    const response = await request(app).delete("/deleteUserReservations").set("Cookie", cookie.user).send(data).expect(httpStatus.OK);
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
