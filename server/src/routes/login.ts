import {Router} from "express";
import validate from "../middleware/validate";
import {loginSchema} from "../validation/auth";
import login from "../controllers/login.controller";

const router = Router();

router.post('/', validate(loginSchema), login);

export {router as loginRouter};