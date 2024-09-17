import { Router } from "express";
import { closeBag, getBotBags } from "../controller/botBag.controller";

const router = Router();

router.get("/getBotBags", getBotBags);
router.post("/closeBag", closeBag);

export { router as botBagRouter };
