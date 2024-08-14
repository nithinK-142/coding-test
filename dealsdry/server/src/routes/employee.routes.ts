import { Router } from "express";
import {
  getEmployees,
  createEmployee,
  editEmployee,
  deleteEmployee,
  loginUser,
  getEmployee,
} from "../controller/user.controller";
import {
  employeeValidation,
  validate,
  loginValidation,
} from "../middleware/validations";

const router = Router();

router.get("/employees/:id", getEmployee);
router.get("/employees", getEmployees);
router.post("/employees", employeeValidation, validate, createEmployee);
router.put("/employees/:id", employeeValidation, validate, editEmployee);
router.delete("/employees/:id", deleteEmployee);
router.post("/login", loginValidation, validate, loginUser);

export { router as employeeRouter };
