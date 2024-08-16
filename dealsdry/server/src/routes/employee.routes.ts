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
  employeeValidation,
  validate,
  loginValidation,
} from "../middleware/validations";
import { upload } from "../utils/upload";

const router = Router();

router.get("/employees/:id", getEmployee);
router.get("/employees", getEmployees);
router.post(
  "/employees",
  // employeeValidation,
  // validate,
  upload.single("f_Image_file"),
  createEmployee
);
router.put(
  "/employees/:id",
  // employeeValidation,
  // validate,
  upload.single("f_Image_file"),
  editEmployee
);
router.delete("/employees/:id", deleteEmployee);
router.post("/login", loginValidation, validate, loginUser);

export { router as employeeRouter };
