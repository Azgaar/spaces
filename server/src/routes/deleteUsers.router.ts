import {Router} from "express";
import {isLogged, isAdmin} from "../middleware/validate";
import {deleteUsersController} from "../controllers";

export const router = Router();
router.delete("/", isLogged, isAdmin, deleteUsersController);
