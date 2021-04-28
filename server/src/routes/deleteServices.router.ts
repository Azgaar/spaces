import {Router} from "express";
import {serviceController} from "../controllers";
import {checkSession, checkRole, validate} from "../middleware/validate";
import {serviceDeleteSchema} from "../validation/service";
import {UserRole} from "../types";

export const router = Router();
router.delete("/", checkSession(true), checkRole(UserRole.ADMIN), validate(serviceDeleteSchema), serviceController.remove);
