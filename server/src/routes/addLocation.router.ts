import {Router} from "express";
import {locationController} from "../controllers";
import {checkRole, checkSession, validate} from "../middleware/validate";
import {UserRole} from "../types";
import {locationSchema} from "../validation/location";

export const router = Router();
router.post("/", checkSession(true), checkRole(UserRole.ADMIN), validate(locationSchema), locationController.add);