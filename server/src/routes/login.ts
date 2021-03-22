import {Router} from "express";
import validate from "../middleware/validate";
import {loginSchema} from "../validation/auth";
import {loginController} from "../controllers";

const router = Router();

router.post('/', validate(loginSchema), loginController);

export {router as loginRouter};