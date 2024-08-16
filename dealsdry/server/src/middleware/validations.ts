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
  body("f_Image_file")
    .optional()
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Image file is required");
      }
      const fileTypes = ["image/jpeg", "image/png"];
      if (!fileTypes.includes(req.file.mimetype)) {
        throw new Error("Invalid file type. Only JPG and PNG are allowed.");
      }
      return true;
    }),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
