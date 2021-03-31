import {Router} from "express";
import {isLogged, validate} from "../middleware/validate";
import {userUpdateSchema} from "../validation/user";
import {updateUserController} from "../controllers";

const router = Router();

router.post("/", isLogged, validate(userUpdateSchema), updateUserController);

export {router as updateUserRouter};
