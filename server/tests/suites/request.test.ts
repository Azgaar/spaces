import request from "supertest";
import httpStatus from "http-status";
import App from "../../src/App";
import config from "../../src/config";
import {MongoMemory, extractCookies} from "../utils";
import {UserData, UserRole, WorkspaceData, WorkspaceStatus, WorkspaceType, LocationData, ReservationData, ReservationStatus, ServiceData} from "../../src/types";
import {createUser} from "../../src/services/user";
import locationService from "../../src/services/location";
import workspaceService from "../../src/services/workspace";
import reservationService from "../../src/services/reservation";

const app = new App().getApp();
let cookie = {admin: "", user: ""};

// test dates
const HOUR: number = 1000 * 60 * 60;
const PAST: Date = new Date();
const IN_1_HOUR: Date = new Date(PAST.getTime() + HOUR);
const IN_2_HOURS: Date = new Date(PAST.getTime() + HOUR * 2);

const admin: UserData = {email: "admin@reg.com", firstName: "John", lastName: "Doe", password: "Secret12", role: UserRole.ADMIN};
const user: UserData = {email: "user@reg.com", firstName: "Jane", lastName: "Dowson", password: "Secret1234", role: UserRole.USER};
const location: LocationData = {description: "testLoc1"};
const workspace: WorkspaceData = {description: "WS_1", location: "", status: WorkspaceStatus.AVAILABLE, type: WorkspaceType.DESK, size: 1, equipment: []};
const reservation: ReservationData = {location: "", workspace: "", requester: user.email, from: IN_1_HOUR, to: IN_2_HOURS};
const servicesList: string[] = ["Request1", "Request2", "Request3"];
const serviceRequest: ServiceData = {location: "", reservationId: "", requester: user.email, servicesList};
let serviceIds = [];

describe("Request service", () => {
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
      location.id = workspace.location = reservation.location = serviceRequest.location = locationDocument.id;
    }

    {
      // add workspace
      const workspaceDocument = await workspaceService.add(workspace);
      expect(workspaceDocument.id).toBeTruthy();
      reservation.workspace = workspaceDocument.id;
    }

    {
      // add reservation
      const reservationDocument = await reservationService.add(reservation);
      expect(reservationDocument.id).toBeTruthy();
      serviceRequest.reservationId = reservationDocument.id;
    }
  });

  it("allows user to request services", async () => {
    const response = await request(app).post("/requestServices").set("Cookie", cookie.user).send(serviceRequest).expect(httpStatus.CREATED);
    console.log(response.body)
    //expect(response.body.id).toBeTruthy();
    //serviceIds = response.body.id;
  });

  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
