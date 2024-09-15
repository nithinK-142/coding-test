import { Router } from "express";
import {
  deleteBag,
  editBag,
  getBags,
  saveBag,
} from "../controller/bag.controller";

const router = Router();

router.get("/getBags", getBags);
router.post("/saveBag", saveBag);
router.put("/editBag/:id", editBag);
router.delete("/deleteBag/:id", deleteBag);

export { router as bagRouter };
