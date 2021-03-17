import express from "express";
//import session from "express-session"; TODO
import mongoose from "mongoose";
import registerRoute from "./routes/register";
import {getURL, OPTIONS} from "./config/db";

const app = express();

// get .env variables in development only
if (app.get("env") === "development") require("dotenv").config();

const PORT = process.env.PORT || 3001;

mongoose.connect(getURL(), OPTIONS);
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(express.json());
app.use("/register", registerRoute);

app.get("/", (req: express.Request, res: express.Response) => res.send("Hello world!"));

app.listen(PORT, () => console.log(`Running on port http://localhost:${PORT}`));

export default app;
