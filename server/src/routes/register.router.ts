import {Router} from "express";
import {notLogged, validate} from "../middleware/validate";
import {registerSchema} from "../validation/user";
import {registerController} from "../controllers";

const router = Router();

router.post("/", notLogged, validate(registerSchema), registerController);

export {router as registerRouter};
