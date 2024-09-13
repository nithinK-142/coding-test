import { Router } from "express";
import { adminRouter } from "./admin.routes";
import { orderRouter } from "./order.routes";
import { deliveryRouter } from "./delivery.routes";
import { bagRouter } from "./bag.routes";

const router = Router();

router.use("/api/v1", adminRouter);
router.use("/api/v1/order", orderRouter);
router.use("/api/v1/delivery", deliveryRouter);
router.use("/api/v1/bag", bagRouter);

export default router;
