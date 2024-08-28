import { Router } from "express";
import {
  getEmployees,
  createEmployee,
  editEmployee,
  deleteEmployee,
  loginUser,
  getEmployee,
} from "../controller/employee.controller";
import {
  validate,
  loginValidation,
  editEmployeeValidation,
  createEmployeeValidation,
} from "../middleware/validations";
import { upload } from "../utils/upload";
import {
  addCourse,
  deleteCourse,
  getCourses,
} from "../controller/course.controller";

const router = Router();

router.get("/employees/:id", getEmployee);
router.get("/employees", getEmployees);
router.post(
  "/employees",
  upload.single("f_Image_file"),
  createEmployeeValidation,
  validate,
  createEmployee
);
router.put(
  "/employees/:id",
  upload.single("f_Image_file"),
  editEmployeeValidation,
  validate,
  editEmployee
);
router.delete("/employees/:id", deleteEmployee);
router.post("/login", loginValidation, validate, loginUser);

router.get("/courses", getCourses);
router.put("/courses", addCourse);
router.delete("/courses", deleteCourse);

export { router as employeeRouter };
