import {Router} from "express";
import {isLogged} from "../middleware/validate";
import {logoutController} from "../controllers";

export const router = Router();
router.post("/", isLogged, logoutController);
