import type { Response } from "express";
import { CourseModel, ICourse } from "../model/courses.model";
import mongoose from "mongoose";
import { EmployeeModel } from "../model/employee.model";

export const handleServerError = (
  res: Response,
  error: any,
  message: string
) => {
  console.error(error);
  res.status(500).json({ message, error: error.message });
};

export const findCourses = async () => {
  const courses = await CourseModel.find().sort({ f_CreatedAt: 1 });
  if (courses.length === 0) {
    throw new Error("Courses not found");
  }
  return courses;
};

export const checkCourseExists = (courses: ICourse[], courseName: string) =>
  courses.some(
    (c) => c.f_CourseName.toLowerCase() === courseName.toLowerCase().trim()
  );

export const findEnrolledEmployees = async (
  courseId: mongoose.Types.ObjectId
) => await EmployeeModel.find({ "f_Course._id": courseId });

export const formatEnrolledEmployees = (employees: any[]) => ({
  enrolledCount: employees.length,
  enrolledEmployees: employees.map((e) => ({ id: e._id, name: e.f_Name })),
});
