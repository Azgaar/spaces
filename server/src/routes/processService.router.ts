import {Router} from "express";
import {serviceController} from "../controllers";
import {checkRole, checkSession, validate} from "../middleware/validate";
import {UserRole} from "../types";
import {serviceProcessSchema,} from "../validation/service";

export const router = Router();
router.post("/", checkSession(true), checkRole(UserRole.ADMIN), validate(serviceProcessSchema), serviceController.process);
