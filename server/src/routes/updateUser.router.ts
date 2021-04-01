import {Router} from "express";
import {isLogged, validate} from "../middleware/validate";
import {userUpdateSchema} from "../validation/user";
import {updateUserController} from "../controllers";

export const router = Router();
router.post("/", isLogged, validate(userUpdateSchema), updateUserController);
