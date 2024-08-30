import type { Request, Response } from "express";
import { CourseModel } from "../model/courses.model";
import {
  getCoursesArray,
  checkCourseExists,
  handleServerError,
  findCourseEntry,
  findEnrolledEmployees,
  formatEnrolledEmployees,
} from "../utils/course";

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
export const addCourse = async (req: Request, res: Response) => {
  try {
    const { course } = req.body;
    if (!course) {
      return res.status(400).json({ message: "Course is required" });
    }

    let courseEntry = await CourseModel.findOne();
    if (courseEntry) {
      const coursesArray = getCoursesArray(courseEntry.courses);
      if (checkCourseExists(coursesArray, course)) {
        return res.status(400).json({ message: "Course already exists" });
      }
      coursesArray.push(course.trim());
      courseEntry.courses = coursesArray.join(",");
    } else {
      courseEntry = new CourseModel({ courses: course.trim() });
    }

    await courseEntry.save();
    res.status(201).json({
      message: "Course added",
      courses: getCoursesArray(courseEntry.courses),
    });
  } catch (error) {
    handleServerError(res, error, "Error adding course");
  }
};

export const editCourse = async (req: Request, res: Response) => {
  try {
    const { oldCourse, newCourse } = req.body;
    if (!oldCourse || !newCourse) {
      return res
        .status(400)
        .json({ message: "Old and new course names are required" });
    }

    const courseEntry = await findCourseEntry();
    const coursesArray = getCoursesArray(courseEntry.courses);
    const index = coursesArray.indexOf(oldCourse);
    if (index === -1) {
      return res.status(404).json({ message: "Course not found in the list" });
    }

    const enrolledEmployees = await findEnrolledEmployees(oldCourse);
    if (enrolledEmployees.length > 0) {
      return res.status(400).json({
        message: `Cannot edit the course, There are ${enrolledEmployees.length} employees enrolled to ${oldCourse}.`,
        ...formatEnrolledEmployees(enrolledEmployees),
      });
    }

    coursesArray[index] = newCourse;
    courseEntry.courses = coursesArray.join(",");
    await courseEntry.save();
    res.status(200).json({ message: "Course updated", courses: coursesArray });
  } catch (error) {
    handleServerError(res, error, "Error updating course");
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { course } = req.body;
    if (!course) {
      return res.status(400).json({ message: "Course is required" });
    }

    const courseEntry = await findCourseEntry();
    const coursesArray = getCoursesArray(courseEntry.courses);
    if (coursesArray.length === 1) {
      return res
        .status(400)
        .json({ message: "There must be at least one course" });
    }

    const index = coursesArray.findIndex(
      (c) => c.toLowerCase() === course.trim().toLowerCase()
    );
    if (index === -1) {
      return res.status(404).json({ message: "Course not found in the list" });
    }

    const enrolledEmployees = await findEnrolledEmployees(course);
    if (enrolledEmployees.length > 0) {
      return res.status(400).json({
        message: `Cannot delete course. There are ${enrolledEmployees.length} employees enrolled to ${course}.`,
        ...formatEnrolledEmployees(enrolledEmployees),
      });
    }

    coursesArray.splice(index, 1);
    courseEntry.courses = coursesArray.join(",");
    await courseEntry.save();
    res.status(200).json({ message: "Course deleted", courses: coursesArray });
  } catch (error) {
    handleServerError(res, error, "Error deleting course");
  }
};
