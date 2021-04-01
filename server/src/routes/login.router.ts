import {Router} from "express";
import {notLogged, validate} from "../middleware/validate";
import {loginSchema} from "../validation/user";
import {loginController} from "../controllers";

export const router = Router();
router.post("/", notLogged, validate(loginSchema), loginController);
