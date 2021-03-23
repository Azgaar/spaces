import request from "supertest";
import httpStatus from "http-status";
import App from "../../src/App";

const app = new App().getApp();

// Jest sets config.env to 'test' that acts as 'production' in @errors.ts
describe("Server", () => {
  it("returns 500 on GET request", () => {
    return request(app).get("/")
      .expect("Content-Type", /json/)
      .expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  it("hides error stack", async () => {
    const response = await request(app).post("/");
    expect(response.body.stack).toBe(false);
  });
});
