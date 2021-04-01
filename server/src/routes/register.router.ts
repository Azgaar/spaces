import {Router} from "express";
import {notLogged, validate} from "../middleware/validate";
import {registerSchema} from "../validation/user";
import {registerController} from "../controllers";

export const router = Router();
router.post("/", notLogged, validate(registerSchema), registerController);
