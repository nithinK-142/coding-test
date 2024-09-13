import { Router } from "express";
import { getBags, saveBag } from "../controller/bag.controller";

const router = Router();

router.get("/getBags", getBags);
router.post("/saveBag", saveBag);

export { router as bagRouter };
