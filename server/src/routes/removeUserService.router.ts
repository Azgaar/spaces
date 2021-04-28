import {Router} from "express";
import {checkSession, validate} from "../middleware/validate";
import {serviceRemovalRequestSchema} from "../validation/service";
import {serviceController} from "../controllers";

export const router = Router();
router.delete("/", checkSession(true), validate(serviceRemovalRequestSchema), serviceController.requestRemoval);
