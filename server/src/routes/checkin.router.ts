import {Router} from "express";
import {authController} from "../controllers";

export const router = Router();
router.post("/", authController.checkin);
