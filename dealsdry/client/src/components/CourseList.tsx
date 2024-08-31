import { useState } from "react";
import { useCourseContext } from "@/context/course-context";

interface ICourse {
  _id: string;
  f_CourseName: string;
  f_CreatedAt: string;
}

export default function CourseList() {
  const { courses, loading, error, addCourse, deleteCourse, updateCourse } =
    useCourseContext();

  const [newCourse, setNewCourse] = useState<string>("");
  const [editingCourse, setEditingCourse] = useState<{
    id: string;
    value: string;
  } | null>(null);

  const handleAddCourse = () => {
    addCourse(newCourse);
    setNewCourse("");
  };

  const handleUpdateCourse = () => {
    if (editingCourse) {
      updateCourse(editingCourse.id, editingCourse.value);
      setEditingCourse(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
  };

  if (loading) return <div>Loading...</div>;

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
            onClick={handleAddCourse}
            className="p-2 text-white bg-blue-500 rounded-md"
          >
            Add Course
          </button>
        </div>
        {/* <button
          onClick={sortCourses}
          className="w-full p-2 text-white bg-green-500 rounded-md"
        >
          Sort Alphabetically
        </button> */}
        {error && (
          <div className="p-2 text-white bg-red-500 rounded-md">{error}</div>
        )}
        <ul className="space-y-2">
          {courses.map((course: ICourse, index: number) => (
            <li
              key={course._id}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              {editingCourse && editingCourse.id === course._id ? (
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
                  <span>{course.f_CourseName}</span>
                </div>
              )}
              <div className="flex">
                {editingCourse && editingCourse.id === course._id ? (
                  <>
                    <button
                      onClick={handleUpdateCourse}
                      className="p-1 mr-1 text-white bg-green-500 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 mr-1 text-white bg-gray-500 rounded-md"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setEditingCourse({
                          id: course._id,
                          value: course.f_CourseName,
                        })
                      }
                      className="p-1 mr-1 text-white bg-yellow-500 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="p-1 text-white bg-red-500 rounded-md"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
