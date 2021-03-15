import express from "express";

const PORT = process.env.PORT || 3001;

const app = express();

if (app.get("env") === "development") require("dotenv").config();

const db = require("./db");
db.initialize(app, "spaces", "users");

app.get("/", (req:express.Request, res:express.Response) => {
  res.send("Hello world!");
});

app.listen(PORT, () => console.log(`Running on port http://localhost:${PORT}`));
