import type { Request, Response } from "express";
import { EmployeeModel } from "../model/employee.model";
import { CourseModel } from "../model/courses.model";

// Fetch all courses
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await CourseModel.find({});

    if (!courses.length) {
      return res.status(404).json({ message: "Courses not found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

// export const addCourse = async (req: Request, res: Response) => {
//   try {
//     const { course } = req.body;

//     if (!course) {
//       return res.status(400).json({ message: "Course is required" });
//     }

//     // Check if the course already exists
//     let courseEntry = await CourseModel.findOne({ courses: course });

//     if (!courseEntry) {
//       // If course does not exist, create it
//       courseEntry = new CourseModel({ courses: course });
//       await courseEntry.save();
//     }

//     res.status(201).json(courseEntry);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error adding course", error });
//   }
// };

export const addCourse = async (req: Request, res: Response) => {
  try {
    const { course } = req.body;

    if (!course) {
      return res.status(400).json({ message: "Course is required" });
    }

    // Find the course document
    let courseEntry = await CourseModel.findOne();

    if (courseEntry) {
      // Check if the course already exists
      let coursesArray = courseEntry.courses.split(",");
      if (coursesArray.includes(course)) {
        return res.status(400).json({ message: "Course already exists" });
      }

      // Append the new course
      coursesArray.push(course);
      courseEntry.courses = coursesArray.join(",");
      await courseEntry.save();
    } else {
      // If course document does not exist, create it with the new course
      courseEntry = new CourseModel({ courses: course });
      await courseEntry.save();
    }

    res
      .status(201)
      .json({ message: "Course added", f_Course: courseEntry.courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding course", error });
  }
};

// export const deleteCourse = async (req: Request, res: Response) => {
//   try {
//     // const { id } = req.params;
//     const { course } = req.body;

//     if (!course) {
//       return res.status(400).json({ message: "Course is required" });
//     }

//     // Delete the course from CourseModel
//     const courseEntry = await CourseModel.findOneAndDelete({ courses: course });

//     if (!courseEntry) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Update employees' course list
//     // await EmployeeModel.updateMany(
//     //   { f_Course: { $regex: `(^|,)${course}(,|$)` } },
//     //   {
//     //     $set: {
//     //       f_Course: {
//     //         $trim: {
//     //           input: {
//     //             $replaceAll: {
//     //               input: "$f_Course",
//     //               find: `,${course},`,
//     //               replacement: ",",
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   }
//     // );

//     res.status(200).json({ message: "Course deleted" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error deleting course", error });
//   }
// };

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { course } = req.body;

    if (!course) {
      return res.status(400).json({ message: "Course is required" });
    }

    // Find and update the document to remove the course
    const courseEntry = await CourseModel.findOne(); // Adjust query if necessary
    if (!courseEntry) {
      return res.status(404).json({ message: "Course document not found" });
    }

    let coursesString = courseEntry.courses;
    let coursesArray = coursesString.split(",");
    const index = coursesArray.indexOf(course);

    if (index === -1) {
      return res.status(404).json({ message: "Course not found in the list" });
    }

    // Remove the course
    coursesArray.splice(index, 1);
    coursesString = coursesArray.join(",");

    courseEntry.courses = coursesString;
    await courseEntry.save();

    // Update employees' course list
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

    res
      .status(200)
      .json({ message: "Course deleted", f_Course: coursesString });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting course", error });
  }
};
