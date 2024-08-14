import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const loginValidation = [
  body("f_userName").notEmpty().withMessage("Username is required"),
  body("f_Pwd").notEmpty().withMessage("Password is required"),
];

export const employeeValidation = [
  body("f_Id").isNumeric().withMessage("Employee ID must be a number"),
  body("f_Name").notEmpty().withMessage("Name is required"),
  body("f_Email").isEmail().withMessage("Invalid email address"),
  body("f_Mobile").isMobilePhone("any").withMessage("Invalid mobile number"),
  body("f_Designation").notEmpty().withMessage("Designation is required"),
  body("f_gender")
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),
  body("f_Course").notEmpty().withMessage("Course is required"),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
