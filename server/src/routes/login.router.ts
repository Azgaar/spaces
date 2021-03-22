import {Router} from "express";
import {notLogged, validate} from "../middleware/validate";
import {loginSchema} from "../validation/auth";
import {loginController} from "../controllers";

const router = Router();

router.post('/', notLogged, validate(loginSchema), loginController);

export {router as loginRouter};