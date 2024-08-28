import { Router } from "express";
import {
  addCourse,
  deleteCourse,
  editCourse,
  getCourses,
} from "../controller/course.controller";

const router = Router();

router.get("/courses", getCourses);
router.post("/courses", addCourse);
router.put("/courses", editCourse);
router.delete("/courses", deleteCourse);

export { router as courseRouter };
