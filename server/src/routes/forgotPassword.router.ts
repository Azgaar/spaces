import {Router} from "express";
import {validate} from "../middleware/validate";
import {forgotPasswordSchema} from "../validation/user";
import {forgotPasswordController} from "../controllers";

export const router = Router();
router.post("/", validate(forgotPasswordSchema), forgotPasswordController);
