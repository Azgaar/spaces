import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import config from "../config";
import logger from "../utils/logger";

const MongoDBStore = connectMongoDBSession(session);

const options = {
  uri: config.mongo.url,
  databaseName: "spaces",
  collection: "sessions",
  connectionOptions: config.mongo.options
}

const mongoStore = new MongoDBStore(options, err => {
  if (err) logger.error(`[MongoStore] ${String(err)}`);
});

mongoStore.on("connected", () => {
  logger.info("[MongoStore] MongoDB connected");
});

mongoStore.on("error", err => {
  logger.error(`[MongoStore] ${String(err)}`);
});

export default mongoStore;
