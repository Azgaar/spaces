import {Router} from "express";
import {checkSession} from "../middleware/validate";
import {logoutController} from "../controllers";

export const router = Router();
router.post("/", checkSession(true), logoutController);
