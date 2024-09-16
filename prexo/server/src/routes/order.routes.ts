import { Router } from "express";
import {
  getOrders,
  ordersExists,
  saveOrder,
} from "../controller/order.controller";

const router = Router();

router.get("/orders", getOrders);
router.post("/save", saveOrder);
router.post("/orders-exists", ordersExists);

export { router as orderRouter };
