import {Router} from "express";
import {checkSession, validate} from "../middleware/validate";
import {userUpdateSchema} from "../validation/user";
import {updateUserController} from "../controllers";

export const router = Router();
router.post("/", checkSession(true), validate(userUpdateSchema), updateUserController);
