import {Router} from "express";
import {checkSession} from "../middleware/validate";
import {workspaceController} from "../controllers";

export const router = Router();
router.post("/", checkSession(true), workspaceController.find);
