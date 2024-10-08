import { Router } from "express";
import {
  getEmployees,
  createEmployee,
  editEmployee,
  deleteEmployee,
  getEmployee,
} from "../controller/employee.controller";
import {
  validate,
  editEmployeeValidation,
  createEmployeeValidation,
} from "../middleware/validations";
import { upload } from "../utils/upload";

const router = Router();

router.get("/employees/:id", getEmployee);
router.get("/employees", getEmployees);
router.post(
  "/employees",
  upload.single("f_Image"),
  createEmployeeValidation,
  validate,
  createEmployee
);
router.put(
  "/employees/:id",
  upload.single("f_Image"),
  editEmployeeValidation,
  validate,
  editEmployee
);
router.delete("/employees/:id", deleteEmployee);

export { router as employeeRouter };
