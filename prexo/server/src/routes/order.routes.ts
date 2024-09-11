import { Router } from "express";
import { saveOrder } from "../controller/order.controller";

const router = Router();

router.post("/save", saveOrder);

export { router as orderRouter };
