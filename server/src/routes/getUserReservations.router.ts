import {Router} from "express";
import {reservationController} from "../controllers";
import {checkSession, checkEmail, validate} from "../middleware/validate";
import {reservationUserListSchema} from "../validation/reservation";

export const router = Router();
router.post("/", checkSession(true), checkEmail, validate(reservationUserListSchema), reservationController.listUserReservations);
