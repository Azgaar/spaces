import {Router} from "express";
import {isLogged, isAdmin} from "../middleware/validate";
import {getUsersController} from "../controllers";

export const router = Router();
router.post("/", isLogged, isAdmin, getUsersController);
