import { Router } from "express";
import { employeeRouter } from "./employee.routes";
import { courseRouter } from "./course.routes";

const router = Router();

router.use("/api/v1", employeeRouter);
router.use("/api/v1", courseRouter);

export default router;
