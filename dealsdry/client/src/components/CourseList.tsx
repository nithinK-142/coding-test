import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/v1/courses";

export default function CourseList() {
  const [courses, setCourses] = useState<string[]>([]);
  const [newCourse, setNewCourse] = useState<string>("");
  const [editingCourse, setEditingCourse] = useState<{
    index: number;
    value: string;
  } | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(API_BASE_URL);
      setCourses(data.courses);
      setNewCourse("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to fetch courses");
    }
  };

  const addCourse = async () => {
    if (!newCourse.trim()) return;

    try {
      const { data } = await axios.post(API_BASE_URL, { course: newCourse });
      setCourses(data.courses);
      setNewCourse("");
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setTimeout(() => setError(""), 2000);
    }
  };

  const deleteCourse = async (course: string) => {
    try {
      const { data } = await axios.delete(API_BASE_URL, { data: { course } });
      setCourses(data.courses);
      setNewCourse("");
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setTimeout(() => setError(""), 2000);
    }
  };

  const startEditing = (index: number, course: string) => {
    setEditingCourse({ index, value: course });
  };

  const saveEdit = async () => {
    if (!editingCourse) return;

    try {
      const { data } = await axios.put(API_BASE_URL, {
        oldCourse: courses[editingCourse.index],
        newCourse: editingCourse.value,
      });
      setCourses(data.courses);
      setNewCourse("");
      setEditingCourse(null);
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setTimeout(() => setError(""), 2000);
    }
  };

  if (courses.length === 0 && !error) return <div>Loading...</div>;

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
            Add Course
          </button>
        </div>
        {error && (
          <div className="p-2 text-white bg-red-500 rounded-md">{error}</div>
        )}
        <ul className="space-y-2">
          {courses.map((course, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              {editingCourse && editingCourse.index === index ? (
                <input
                  type="text"
                  value={editingCourse.value}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      value: e.target.value,
                    })
                  }
                  className="w-full p-1 mr-2 text-black border rounded-md"
                />
              ) : (
                <div>
                  <span className="mr-2">{index + 1}</span>
                  <span>{course}</span>
                </div>
              )}
              <div>
                {/* {editingCourse && editingCourse.index === index ? (
                  <button
                    onClick={saveEdit}
                    className="p-1 mr-1 text-white bg-green-500 rounded-md"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(index, course)}
                    className="p-1 mr-1 text-white bg-yellow-500 rounded-md"
                  >
                    Edit
                  </button>
                )} */}
                <button
                  onClick={() => deleteCourse(course)}
                  className="p-1 text-white bg-red-500 rounded-md"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
