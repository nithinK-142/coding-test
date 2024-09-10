import { Router } from "express";
import { adminLogin, createAdmin } from "../controller/admin.controller";
import { validate, authValidation } from "../middleware/validations";

const router = Router();

router.post("/login", authValidation, validate, adminLogin);
// router.post("/create-admin", authValidation, validate, createAdmin);

export { router as adminRouter };
