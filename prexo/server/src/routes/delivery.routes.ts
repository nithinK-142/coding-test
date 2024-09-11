import { Router } from "express";
import { saveDelivery } from "../controller/delivery.controller";

const router = Router();

router.post("/save", saveDelivery);

export { router as deliveryRouter };
