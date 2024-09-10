import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const authValidation = [
  body("f_UserName").notEmpty().withMessage("Username is required"),
  body("f_Pwd").notEmpty().withMessage("Password is required"),
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
