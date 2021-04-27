import {Router} from "express";
import {serviceController} from "../controllers";
import {checkSession, validate} from "../middleware/validate";
import {serviceRequestSchema} from "../validation/service";

export const router = Router();
router.post("/", checkSession(true), validate(serviceRequestSchema), serviceController.add);
