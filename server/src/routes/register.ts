import {Router} from "express";
import validate from "../middleware/validate";
import {registerSchema} from "../validation/auth";
import {registerController} from "../controllers";

const router = Router();

router.post('/', validate(registerSchema), registerController);

export {router as registerRouter};