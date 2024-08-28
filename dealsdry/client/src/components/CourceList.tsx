import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IEmployee } from "./EmployeeList";

export default function CourseList() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [courses, setCourses] = useState<string>("");
  const [newCourse, setNewCourse] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function getEmployeeDetails() {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/v1/courses/${id}`
        );
        setEmployee(data);
        setCourses(data.f_Course || "");
      } catch (error) {
        console.error(error);
        setError("Failed to fetch employee details");
      }
    }

    getEmployeeDetails();
  }, [id]);

  const addCourse = async () => {
    if (!newCourse.trim()) return;

    try {
      const { data } = await axios.put(
        `http://localhost:3001/api/v1/courses/${id}`,
        { course: newCourse }
      );
      setCourses(data.f_Course);
      setNewCourse("");
    } catch (error) {
      console.error(error);
      setError("Failed to add course");
    }
  };

  const deleteCourse = async (course: string) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:3001/api/v1/courses/${id}`,
        { data: { course } }
      );
      setCourses(data.f_Course);
    } catch (error) {
      console.error(error);
      setError("Failed to delete course");
    }
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-md p-4 mx-auto border rounded-md">
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          Course Management for {employee.f_Name}
        </h2>
      </div>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            placeholder="Enter new course"
            className="w-full p-2 text-black border rounded-md"
          />
          <button
            onClick={addCourse}
            className="p-2 text-white bg-blue-500 rounded-md"
          >
            Add Course
          </button>
        </div>
        {error && (
          <div className="p-2 text-white bg-red-500 rounded-md">{error}</div>
        )}
        <ul className="space-y-2">
          {courses.split(",").map((course, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <span>{course.trim()}</span>
              <button
                onClick={() => deleteCourse(course.trim())}
                className="p-1 text-gray-700 bg-gray-200 rounded-md"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
