import type { Request, Response } from "express";
import { CourseModel } from "../model/courses.model";
import { EmployeeModel } from "../model/employee.model";

export const handleServerError = (
  res: Response,
  error: any,
  message: string
) => {
  console.error(error);
  res.status(500).json({ message, error });
};

export const findCourseEntry = async () => {
  const courseEntry = await CourseModel.findOne();
  if (!courseEntry || !courseEntry.courses) {
    throw new Error("Courses not found");
  }
  return courseEntry;
};

export const getCoursesArray = (courses: string) =>
  courses.split(",").map((c) => c.trim());

export const checkCourseExists = (coursesArray: string[], course: string) =>
  coursesArray
    .map((c) => c.toLowerCase())
    .includes(course.toLowerCase().trim());

export const findEnrolledEmployees = async (course: string) =>
  await EmployeeModel.find({
    f_Course: { $regex: new RegExp(`\\b${course}\\b`, "i") },
  });

export const formatEnrolledEmployees = (employees: any[]) => ({
  enrolledCount: employees.length,
  enrolledEmployees: employees.map((e) => ({ id: e.f_Id, name: e.f_Name })),
});

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courseEntry = await findCourseEntry();
    res.status(200).json({ courses: getCoursesArray(courseEntry.courses) });
  } catch (error) {
    if (error instanceof Error && error.message === "Courses not found") {
      res.status(404).json({ message: error.message });
    } else {
      handleServerError(res, error, "Error fetching courses");
    }
  }
};
