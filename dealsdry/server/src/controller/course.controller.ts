import type { Request, Response } from "express";
import { CourseModel } from "../model/courses.model";

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courseEntry = await CourseModel.findOne();

    if (!courseEntry || !courseEntry.courses) {
      return res.status(404).json({ message: "Courses not found" });
    }
    res.status(200).json({ courses: courseEntry.courses.split(",") });
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
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
      const coursesArray = courseEntry.courses.split(",");
      if (coursesArray.includes(course)) {
        return res.status(400).json({ message: "Course already exists" });
      }
      coursesArray.push(course);
      courseEntry.courses = coursesArray.join(",");
    } else {
      courseEntry = new CourseModel({ courses: course });
    }

    await courseEntry.save();

    res.status(201).json({
      message: "Course added",
      courses: courseEntry.courses.split(","),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding course", error });
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

    const courseEntry = await CourseModel.findOne();
    if (!courseEntry) {
      return res.status(404).json({ message: "Course document not found" });
    }

    const coursesArray = courseEntry.courses.split(",");
    const index = coursesArray.indexOf(oldCourse);
    if (index === -1) {
      return res.status(404).json({ message: "Course not found in the list" });
    }

    coursesArray[index] = newCourse;
    courseEntry.courses = coursesArray.join(",");
    await courseEntry.save();

    res.status(200).json({ message: "Course updated", courses: coursesArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating course", error });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { course } = req.body;

    if (!course) {
      return res.status(400).json({ message: "Course is required" });
    }

    const courseEntry = await CourseModel.findOne();
    if (!courseEntry) {
      return res.status(404).json({ message: "Course document not found" });
    }

    const coursesArray = courseEntry.courses.split(",");
    const index = coursesArray.indexOf(course);
    if (index === -1) {
      return res.status(404).json({ message: "Course not found in the list" });
    }

    coursesArray.splice(index, 1);
    courseEntry.courses = coursesArray.join(",");
    await courseEntry.save();

    // await EmployeeModel.updateMany(
    //   { f_Course: { $regex: `(^|,)${course}(,|$)` } },
    //   {
    //     $set: {
    //       f_Course: {
    //         $trim: {
    //           input: {
    //             $replaceAll: {
    //               input: "$f_Course",
    //               find: `,${course},`,
    //               replacement: ",",
    //             },
    //           },
    //         },
    //       },
    //     },
    //   }
    // );

    res.status(200).json({ message: "Course deleted", courses: coursesArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting course", error });
  }
};
