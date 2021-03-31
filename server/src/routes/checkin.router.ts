import {Router} from "express";
import {checkinController} from "../controllers";

const router = Router();

router.post("/", checkinController);

export {router as checkinRouter};
