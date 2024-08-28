import { Router } from "express";
import {
  addCourse,
  deleteCourse,
  getCourses,
} from "../controller/course.controller";

const router = Router();

router.get("/courses", getCourses);
router.put("/courses", addCourse);
router.delete("/courses", deleteCourse);

export { router as courseRouter };
