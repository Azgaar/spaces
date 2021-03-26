import {Router} from "express";
import {isLogged} from "../middleware/validate";
import {logoutController} from "../controllers";

const router = Router();

router.post('/', isLogged, logoutController);

export {router as logoutRouter};