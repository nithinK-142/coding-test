import type { Request, Response } from "express";
import { EmployeeModel, IEmployee } from "../model/employee.model";
import { LoginModel, ILogin } from "../model/login.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await EmployeeModel.findOne({ f_Id: id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees: IEmployee[] = await EmployeeModel.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const newEmployee: IEmployee = new EmployeeModel(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error creating employee", error });
  }
};

export const editEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      const imagePath = `http://localhost:3001/public/temp/${req.file.filename}`;
      updateData.f_Image = imagePath;
    }

    const updatedEmployee = await EmployeeModel.findOneAndUpdate(
      { f_Id: id },
      updateData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await EmployeeModel.findOneAndDelete({ f_Id: id });

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { f_userName, f_Pwd } = req.body;
    const user: ILogin | null = await LoginModel.findOne({ f_userName });

    if (!user) {
      return res.status(401).json({ message: "Invalid login details" });
    }

    const isPasswordValid = await bcrypt.compare(f_Pwd, user.f_Pwd);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid login details" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.f_userName },
      process.env.JWT_SECRET || "dealsdry",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.f_userName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};
