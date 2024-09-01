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
    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course } =
      req.body;

    const f_Course_Parsed =
      typeof f_Course === "string" ? JSON.parse(f_Course) : f_Course;

    const f_Image = req.file
      ? `http://localhost:3001/public/temp/${req.file.filename}`
      : undefined;

    if (
      !f_Name ||
      !f_Email ||
      !f_Mobile ||
      !f_Designation ||
      !f_Gender ||
      !f_Course ||
      !Array.isArray(f_Course_Parsed) ||
      f_Course_Parsed.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const courses = await CourseModel.find({
      _id: {
        $in: f_Course_Parsed.map(
          (course: string) => new mongoose.Types.ObjectId(course)
        ),
      },
    });

    if (courses.length !== f_Course_Parsed.length) {
      return res
        .status(404)
        .json({ message: "Some courses not found or invalid" });
    }

    const courseDetails = courses.map((course) => ({
      _id: course._id,
      f_CourseName: course.f_CourseName,
    }));

    const newEmployee: IEmployee = new EmployeeModel({
      _id: new mongoose.Types.ObjectId(),
      f_Image,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course: courseDetails,
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
    const {
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_Gender,
      f_Course,
      avatarState,
    } = req.body;

    const f_Image =
      avatarState === "true"
        ? "https://demofree.sirv.com/nope-not-here.jpg"
        : req.file
        ? `http://localhost:3001/public/temp/${req.file.filename}`
        : undefined;

    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (f_Course) {
      const f_Course_Parsed =
        typeof f_Course === "string" ? JSON.parse(f_Course) : f_Course;
      const courses = await CourseModel.find({
        _id: {
          $in: f_Course_Parsed.map(
            (course: string) => new mongoose.Types.ObjectId(course)
          ),
        },
      });

      if (courses.length !== f_Course_Parsed.length) {
        return res
          .status(404)
          .json({ message: "Some courses not found or invalid" });
      }

      employee.f_Course = courses.map((course) => ({
        _id: course._id,
        f_CourseName: course.f_CourseName,
      }));
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
