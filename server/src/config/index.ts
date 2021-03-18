import dotenv from "dotenv";
import {getMongoURL, MONGO_OPTIONS} from "./db";

const env = process.env.NODE_ENV || "development";

if (env !== "production") dotenv.config();

const port = process.env.PORT || 3001;
const mongo = {url: getMongoURL(), options: MONGO_OPTIONS};

const config = {env, port, mongo};

export default config;
