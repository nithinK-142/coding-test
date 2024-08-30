import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const authValidation = [
  body("f_UserName").notEmpty().withMessage("Username is required"),
  body("f_Pwd").notEmpty().withMessage("Password is required"),
];

export const employeeValidation = [
  body("f_Name").notEmpty().withMessage("Name is required"),
  body("f_Email").isEmail().withMessage("Invalid email address"),
  body("f_Mobile").isMobilePhone("any").withMessage("Invalid mobile number"),
  body("f_Designation").notEmpty().withMessage("Designation is required"),
  body("f_Gender")
    .isIn(["Male", "Female", "other"])
    .withMessage("Invalid gender"),
  body("f_Course").notEmpty().withMessage("Course is required"),
];

export const createEmployeeValidation = [
  ...employeeValidation,
  body("f_Image_file").custom((value, { req }) => {
    if (req.file && !["image/jpeg", "image/png"].includes(req.file.mimetype)) {
      throw new Error("Invalid file type. Only JPG and PNG are allowed.");
    }
    return true;
  }),
];

export const editEmployeeValidation = [
  ...employeeValidation,
  body("f_Image_file")
    .optional()
    .custom((value, { req }) => {
      if (
        req.file &&
        !["image/jpeg", "image/png"].includes(req.file.mimetype)
      ) {
        throw new Error("Invalid file type. Only JPG and PNG are allowed.");
      }
      return true;
    }),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(
      "Validation errors:",
      errors.array().map((e) => e.msg)
    );
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
