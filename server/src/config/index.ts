import dotenv from "dotenv";
import {getMongoURL, MONGO_OPTIONS} from "./db";
import {getSessionConfig} from "./session";

const env = process.env.NODE_ENV || "development";

if (env !== "production") dotenv.config();

const port = process.env.PORT || 3001;
const mongo = {url: getMongoURL(), options: MONGO_OPTIONS};

const joi = {
  options: {
    abortEarly: true,
    errors: {
      wrap: {
        label: "`"
      }
    }
  }
};

const session = getSessionConfig();

const config = {env, port, mongo, joi, session};

export default config;
