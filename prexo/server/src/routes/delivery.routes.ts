import { Router } from "express";
import { getDeliveries, saveDelivery } from "../controller/delivery.controller";

const router = Router();

router.get("/deliveries", getDeliveries);
router.post("/save", saveDelivery);

export { router as deliveryRouter };
