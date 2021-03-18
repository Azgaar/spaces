import {Router} from "express";
import registerSchema from "../validation/auth";
import {User} from "../models/user";

const PROD = process.env.NODE_ENV === "production";
const router = Router();

router.post("/", async (req, res) => {
  await registerSchema.validateAsync(req.body, {abortEarly: true}).catch(err => {
    res.status(400).json({message: "Invalid request"});
  });

  const {email, firstName, lastName, password} = req.body;
  const userExists = await User.exists({email}).catch(err => {
    res.status(400).json({message: "Database issue", err});
  });

  if (userExists) {
    res.status(400).json(PROD ? {message: "Invalid request"} : {message: "User already exists", email});
    return;
  }

  const newUser = await User.create({email, firstName, lastName, password}).catch(err => {
    res.status(400).json({message: "Database issue", err});
  });

  res.json(PROD ? {message: "OK"} : {message: "OK", newUser});
});

export {router as registerRouter};