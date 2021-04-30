import {Mongoose} from "mongoose";
import {mongoConnecter} from "../../src/connections";

describe("Mongo DB connection", () => {
  let mongoose: Mongoose;

  it("can be successfully established", async () => {
    mongoose = await mongoConnecter.connect() as Mongoose;
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("can be successfully closed", async () => {
    await mongoConnecter.close();
    expect(mongoose.connection.readyState).toBe(0);
  });
});
