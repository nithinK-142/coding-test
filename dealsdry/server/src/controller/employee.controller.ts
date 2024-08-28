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
    const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } =
      req.body;

    let imagePath: string | undefined;
    if (req.file) {
      imagePath = `http://localhost:3001/public/temp/${req.file.filename}`;
    }

    const lastEmployee = await EmployeeModel.findOne()
      .sort({ f_Id: -1 })
      .exec();

    const newEmployeeId = lastEmployee ? lastEmployee.f_Id + 1 : 1;

    const newEmployee = new EmployeeModel({
      f_Id: newEmployeeId,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_gender,
      f_Course,
      f_Image: imagePath,
    });

    const savedEmployee = await newEmployee.save();

    res.status(201).json(savedEmployee);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Error creating employee", error });
  }
};

const IMAGE_NOT_FOUND_URL = "https://demofree.sirv.com/nope-not-here.jpg"; // Update this URL as needed

export const editEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.delete_image === "true") {
      // If delete_image is true, set the image to the "not found" URL
      updateData.f_Image = IMAGE_NOT_FOUND_URL;
    } else if (req.file) {
      // If a new file is uploaded, update the image path
      const imagePath = `http://localhost:3001/public/temp/${req.file.filename}`;
      updateData.f_Image = imagePath;
    }

    // Remove the delete_image field from updateData as it's not part of the Employee model
    delete updateData.delete_image;
    const updatedEmployee = await EmployeeModel.findOneAndUpdate(
      { f_Id: id },
      updateData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error: any) {
    console.error("Error updating employee:", error);
    res
      .status(500)
      .json({ message: "Error updating employee", error: error.message });
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
