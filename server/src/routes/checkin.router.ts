import {Router} from "express";
import {checkinController} from "../controllers";

export const router = Router();
router.post("/", checkinController);
