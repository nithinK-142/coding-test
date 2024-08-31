import type { Request, Response } from "express";
import { CourseModel } from "../model/courses.model";
import mongoose from "mongoose";
import {
  findCourses,
  handleServerError,
  checkCourseExists,
  findEnrolledEmployees,
  formatEnrolledEmployees,
} from "../utils/utility";

export const getCourses = async (_req: Request, res: Response) => {
  try {
    const courses = await findCourses();
    res.status(200).json({ courses });
  } catch (error) {
    if (error instanceof Error && error.message === "Courses not found") {
      res.status(404).json({ message: error.message });
    } else {
      handleServerError(res, error, "Error fetching courses");
    }
  }
};

export const addCourse = async (req: Request, res: Response) => {
  try {
    const { f_CourseName } = req.body;
    if (!f_CourseName) {
      return res.status(400).json({ message: "Course name is required" });
    }

    const courses = await CourseModel.find();
    if (checkCourseExists(courses, f_CourseName)) {
      return res.status(400).json({ message: "Course already exists" });
    }

    const newCourse = new CourseModel({
      _id: new mongoose.Types.ObjectId(),
      f_CourseName: f_CourseName.trim(),
    });

    await newCourse.save();

    res.status(201).json({
      message: "Course added",
      courses: await findCourses(),
    });
  } catch (error) {
    handleServerError(res, error, "Error adding course");
  }
};

export const editCourse = async (req: Request, res: Response) => {
  try {
    const { oldCourseId, newCourseName } = req.body;
    if (!oldCourseId || !newCourseName) {
      return res
        .status(400)
        .json({ message: "Course ID and new course name are required" });
    }

    const course = await CourseModel.findById(oldCourseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.f_CourseName === newCourseName) {
      return res.status(400).json({ message: "Course name is same" });
    }

    const enrolledEmployees = await findEnrolledEmployees(course._id);
    if (enrolledEmployees.length > 0) {
      return res.status(400).json({
        message: `Cannot edit the course. There are ${enrolledEmployees.length} employees enrolled in ${course.f_CourseName}.`,
        ...formatEnrolledEmployees(enrolledEmployees),
      });
    }

    course.f_CourseName = newCourseName.trim();
    await course.save();

    res
      .status(200)
      .json({ message: "Course updated", courses: await findCourses() });
  } catch (error) {
    handleServerError(res, error, "Error updating course");
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const courses = await CourseModel.find();
    if (courses.length === 1) {
      return res
        .status(400)
        .json({ message: "There must be at least one course" });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrolledEmployees = await findEnrolledEmployees(course._id);
    if (enrolledEmployees.length > 0) {
      return res.status(400).json({
        message: `Cannot delete course. There are ${enrolledEmployees.length} employees enrolled in ${course.f_CourseName}.`,
        ...formatEnrolledEmployees(enrolledEmployees),
      });
    }

    await CourseModel.deleteOne({ _id: course._id });

    res
      .status(200)
      .json({ message: "Course deleted", courses: await findCourses() });
  } catch (error) {
    handleServerError(res, error, "Error deleting course");
  }
};
