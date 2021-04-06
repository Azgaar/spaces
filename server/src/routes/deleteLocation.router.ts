import {Router} from "express";
import {locationController} from "../controllers";
import {checkRole, checkSession, validate} from "../middleware/validate";
import {UserRole} from "../types";
import {locationIdSchema} from "../validation/location";

export const router = Router();
router.delete("/", checkSession(true), checkRole(UserRole.ADMIN), validate(locationIdSchema), locationController.remove);
