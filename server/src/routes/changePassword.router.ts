import {Router} from "express";
import {isLogged, validate} from "../middleware/validate";
import {passwordChangeSchema} from "../validation/user";
import {changePasswordController} from "../controllers";

export const router = Router();
router.post("/", isLogged, validate(passwordChangeSchema), changePasswordController);
