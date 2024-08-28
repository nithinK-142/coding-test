import { useEffect, useState } from "react";
import axios from "axios";

export default function CourseList() {
  const [courses, setCourses] = useState<string>("");
  const [newCourse, setNewCourse] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getCourses = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/v1/courses`
        );
        console.log(data[0].courses);
        setCourses(data[0].courses);
        setNewCourse("");
      } catch (error) {
        console.error(error);
        setError("Failed to add course");
      }
    };
    getCourses();
  }, []);

  const addCourse = async () => {
    if (!newCourse.trim()) return;

    try {
      const { data } = await axios.put(
        `http://localhost:3001/api/v1/courses/`,
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
        `http://localhost:3001/api/v1/courses/`,
        { data: { course } }
      );
      setCourses(data.f_Course);
    } catch (error) {
      console.error(error);
      setError("Failed to delete course");
    }
  };

  if (!courses) return <div>Loading...</div>;

  return (
    <div className="w-full max-w-md p-4 mx-auto border rounded-md">
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
            AddCourse
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
                className="p-1 text-gray-700 bg-red-400 rounded-md"
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
