import { Router } from "express";
import { employeeRouter } from "./employee.routes";

const router = Router();

router.use("/api/v1", employeeRouter);

export default router;
