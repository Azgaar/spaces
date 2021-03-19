import {Router} from "express";
import validate from "../middleware/validate";
import registerSchema from "../validation/auth";
import register from "../controllers/registration.controller";

const router = Router();

router.post('/', validate(registerSchema), register);

export {router as registerRouter};