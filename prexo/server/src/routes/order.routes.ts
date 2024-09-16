import { Router } from "express";
import { ordersExists, saveOrder } from "../controller/order.controller";

const router = Router();

router.post("/save", saveOrder);
router.post("/orders-exists", ordersExists);

export { router as orderRouter };
