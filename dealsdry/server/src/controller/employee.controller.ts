import type { Request, Response } from "express";
import { EmployeeModel, IEmployee } from "../model/employee.model";
import { CourseModel } from "../model/courses.model";
import mongoose from "mongoose";
import { handleServerError } from "../utils/utility";

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ employee });
  } catch (error) {
    handleServerError(res, error, "Error fetching employee");
  }
};

export const getEmployees = async (_req: Request, res: Response) => {
  try {
    const employees = await EmployeeModel.find().sort({ f_CreatedAt: -1 });
    res.status(200).json({ employees });
  } catch (error) {
    handleServerError(res, error, "Error fetching employees");
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_CourseId } =
      req.body;
    const f_Image = req.file
      ? `http://localhost:3001/public/temp/${req.file.filename}`
      : undefined;

    if (
      !f_Name ||
      !f_Email ||
      !f_Mobile ||
      !f_Designation ||
      !f_Gender ||
      !f_CourseId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const course = await CourseModel.findById(f_CourseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newEmployee: IEmployee = new EmployeeModel({
      _id: new mongoose.Types.ObjectId(),
      f_Image,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course: {
        _id: course._id,
        f_CourseName: course.f_CourseName,
      },
    });

    await newEmployee.save();
    res
      .status(201)
      .json({ message: "Employee created", employee: newEmployee });
  } catch (error) {
    handleServerError(res, error, "Error creating employee");
  }
};

export const editEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_CourseId } =
      req.body;
    const f_Image = req.file
      ? `http://localhost:3001/public/temp/${req.file.filename}`
      : undefined;

    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (f_CourseId && f_CourseId !== employee.f_Course._id.toString()) {
      const course = await CourseModel.findById(f_CourseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      employee.f_Course = {
        _id: course._id,
        f_CourseName: course.f_CourseName,
      };
    }

    if (f_Name) employee.f_Name = f_Name;
    if (f_Email) employee.f_Email = f_Email;
    if (f_Mobile) employee.f_Mobile = f_Mobile;
    if (f_Designation) employee.f_Designation = f_Designation;
    if (f_Gender) employee.f_Gender = f_Gender;
    if (f_Image) employee.f_Image = f_Image;

    await employee.save();
    res.status(200).json({ message: "Employee updated", employee });
  } catch (error) {
    handleServerError(res, error, "Error updating employee");
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await EmployeeModel.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    handleServerError(res, error, "Error deleting employee");
  }
};
