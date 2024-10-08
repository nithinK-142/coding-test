import type { Request, Response } from "express";
import { LoginModel, ILogin } from "../model/login.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { f_UserName, f_Pwd } = req.body;

    const user: ILogin | null = await LoginModel.findOne({ f_UserName });

    if (!user) {
      return res.status(401).json({ message: "Invalid login details" });
    }

    const isPasswordValid = await bcrypt.compare(f_Pwd, user.f_Pwd);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid login details" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.f_UserName },
      process.env.JWT_SECRET || "dealsdry",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.f_UserName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { f_UserName, f_Pwd } = req.body;

    const existingAdmin = await LoginModel.findOne({ f_UserName });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(f_Pwd, 10);

    const newAdmin = new LoginModel({
      f_UserName,
      f_Pwd: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        username: newAdmin.f_UserName,
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({
      message: "Failed to create admin",
      error: (error as Error).message,
    });
  }
};
