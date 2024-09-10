import { Router } from "express";
import { adminRouter } from "./admin.routes";

const router = Router();

router.use("/api/v1", adminRouter);

export default router;
