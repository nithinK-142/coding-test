import { Router } from "express";
import {
  checkBag,
  deleteBag,
  editBag,
  getBags,
  saveBag,
} from "../controller/bag.controller";

const router = Router();

router.get("/getBags", getBags);
router.get("/checkBag/:bagId", checkBag);
router.post("/saveBag", saveBag);
router.put("/editBag/:id", editBag);
router.delete("/deleteBag/:id", deleteBag);

export { router as bagRouter };
