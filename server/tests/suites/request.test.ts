import request from "supertest";
import httpStatus from "http-status";
import App from "../../src/App";
import config from "../../src/config";
import {MongoMemory, extractCookies} from "../utils";
import {UserData, UserRole, WorkspaceData, WorkspaceStatus, WorkspaceType, LocationData, ReservationData, ServiceData, ServiceRequestStatus, ServiceDocument} from "../../src/types";
import {createUser} from "../../src/services/user";
import locationService from "../../src/services/location";
import workspaceService from "../../src/services/workspace";
import reservationService from "../../src/services/reservation";

const app = new App().getApp();
let cookie = {admin: "", user: ""};

const HOUR: number = 1000 * 60 * 60;
const CURRENT: Date = new Date();
const IN_1_HOUR: Date = new Date(CURRENT.getTime() + HOUR);
const IN_2_HOURS: Date = new Date(CURRENT.getTime() + HOUR * 2);

const initialServices = ["Request1", "Request2", "Request3"];
const additionalServices = ["Request4", "Request5", "Request6"];

const admin: UserData = {email: "admin@reg.com", firstName: "John", lastName: "Doe", password: "Secret12", role: UserRole.ADMIN};
const user: UserData = {email: "user@reg.com", firstName: "Jane", lastName: "Dowson", password: "Secret1234", role: UserRole.USER};
const location: LocationData = {description: "testLoc1"};
const workspace: WorkspaceData = {description: "WS_1", location: "", status: WorkspaceStatus.AVAILABLE, type: WorkspaceType.DESK, size: 1, equipment: []};
const reservation: ReservationData = {location: "", workspace: "", requester: user.email, from: IN_1_HOUR, to: IN_2_HOURS};
const serviceRequest: ServiceData = {location: "", reservationId: "", requester: user.email, servicesList: initialServices};
let serviceIds: string[] = [];

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
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(serviceRequest.servicesList.length);
    response.body.forEach((res: ServiceDocument, index: number) => {
      expect(res.requester).toBe(serviceRequest.requester);
      expect(res.status).toBe(ServiceRequestStatus.PENDING);
      expect(res.reservation).toBe(serviceRequest.reservationId);
      expect(res.description).toBe(serviceRequest.servicesList[index]);
      expect(res.id).toBeTruthy();
    });
  });

  it("allows user to request additional services", async () => {
    serviceRequest.servicesList = additionalServices;
    const response = await request(app).post("/requestServices").set("Cookie", cookie.user).send(serviceRequest).expect(httpStatus.CREATED);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(serviceRequest.servicesList.length);

    response.body.forEach((res: ServiceDocument, index: number) => {
      expect(res.requester).toBe(serviceRequest.requester);
      expect(res.status).toBe(ServiceRequestStatus.PENDING);
      expect(res.reservation).toBe(serviceRequest.reservationId);
      expect(res.description).toBe(serviceRequest.servicesList[index]);
      expect(res.id).toBeTruthy();
    });
  });

  it("allows user to list his reservations with request data added", async () => {
    const expectedServicesList = initialServices.concat(additionalServices);
    const response = await request(app).post("/getUserReservations").set("Cookie", cookie.user).send({email: user.email, active: true}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].requests.length).toBe(expectedServicesList.length);
    response.body[0].requests.forEach((res: ServiceDocument, index: number) => {
      expect(res.requester).toBe(serviceRequest.requester);
      expect(res.status).toBe(ServiceRequestStatus.PENDING);
      expect(res.reservation).toBe(serviceRequest.reservationId);
      expect(res.description).toBe(expectedServicesList[index]);
      expect(res.id).toBeTruthy();
      serviceIds[index] = res.id;
    });
  });

  it("allows user to delete his request", async () => {
    const data = {id: serviceIds.pop(), requester: user.email};
    const response = await request(app).delete("/removeUserService").set("Cookie", cookie.user).send(data)//.expect(httpStatus.OK);
    expect(response.body.id).toBe(data.id);
  });

  it("not allows user to manage requests", async () => {
    const {PENDING, FULFILLED} = ServiceRequestStatus;
    await request(app).post("/getServices").set("Cookie", cookie.user).send({location: serviceRequest.location, status: PENDING}).expect(httpStatus.INTERNAL_SERVER_ERROR);
    await request(app).post("/processServices").set("Cookie", cookie.user).send({serviceIds, status: FULFILLED}).expect(httpStatus.INTERNAL_SERVER_ERROR);
    await request(app).delete("/deleteServices").set("Cookie", cookie.user).send({serviceIds}).expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it("allows admin to list all requests", async () => {
    const status = ServiceRequestStatus.PENDING;
    const response = await request(app).post("/getServices").set("Cookie", cookie.admin).send({location: serviceRequest.location, status}).expect(httpStatus.OK);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(serviceIds.length);
  });

  it("allows admin to process requests", async () => {
    const status = ServiceRequestStatus.FULFILLED;
    const resPreProcess = await request(app).post("/getServices").set("Cookie", cookie.admin).send({location: serviceRequest.location, status}).expect(httpStatus.OK);
    expect(Array.isArray(resPreProcess.body)).toBe(true);
    expect(resPreProcess.body.length).toBe(0);

    await request(app).post("/processServices").set("Cookie", cookie.admin).send({serviceIds, status}).expect(httpStatus.OK);
    const resPostProcess = await request(app).post("/getServices").set("Cookie", cookie.admin).send({location: serviceRequest.location, status}).expect(httpStatus.OK);
    expect(Array.isArray(resPostProcess.body)).toBe(true);
    expect(resPostProcess.body.length).toBe(serviceIds.length);
  });

  it("allows admin to delete requests", async () => {
    const status = ServiceRequestStatus.FULFILLED;
    const resPreDeletion = await request(app).post("/getServices").set("Cookie", cookie.admin).send({location: serviceRequest.location, status}).expect(httpStatus.OK);
    expect(Array.isArray(resPreDeletion.body)).toBe(true);
    expect(resPreDeletion.body.length).toBe(serviceIds.length);

    await request(app).delete("/deleteServices").set("Cookie", cookie.admin).send({serviceIds});
    const resPostDeletion = await request(app).post("/getServices").set("Cookie", cookie.admin).send({location: serviceRequest.location, status}).expect(httpStatus.OK);
    expect(Array.isArray(resPostDeletion.body)).toBe(true);
    expect(resPostDeletion.body.length).toBe(0);
  });
  
  afterAll(() => {
    MongoMemory.closeDatabase();
  });
});
