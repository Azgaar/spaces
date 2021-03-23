import winston from "winston";
import config from "../config";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: null, //{service: "user-service"},
  transports: [
    new winston.transports.File({filename: "error.log", level: "error"}),
    new winston.transports.File({filename: "combined.log"})
  ]
});

if (config.env === "development") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

export default logger;