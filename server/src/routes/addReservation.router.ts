import {Router} from "express";
import {reservationController} from "../controllers";
import {checkRole, checkSession, validate} from "../middleware/validate";
import {UserRole} from "../types";
import {reservationCreationSchema} from "../validation/reservation";

export const router = Router();
router.post("/", checkSession(true), checkRole(UserRole.ADMIN), validate(reservationCreationSchema), reservationController.add);
