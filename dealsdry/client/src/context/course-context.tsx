import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/v1/courses";

interface ICourse {
  _id: string;
  f_CourseName: string;
  f_CreatedAt: string;
}

type MessageType = {
  message: string;
  isError: boolean;
};

const messageDefault: MessageType = {
  message: "",
  isError: false,
};

interface ICourseContext {
  courses: ICourse[];
  loading: boolean;
  message: MessageType;
  fetchCourses: () => Promise<void>;
  addCourse: (newCourseName: string) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  updateCourse: (courseId: string, newCourseName: string) => Promise<void>;
  sortCourses: (courses: ICourse[]) => ICourse[];
}

const CourseContext = createContext<ICourseContext>({
  courses: [],
  loading: false,
  message: messageDefault,
  fetchCourses: () => Promise.resolve(),
  addCourse: () => Promise.resolve(),
  deleteCourse: () => Promise.resolve(),
  updateCourse: () => Promise.resolve(),
  sortCourses: (courses) => courses,
});

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageType>(messageDefault);

  const resetMessage = useCallback(() => {
    setTimeout(() => {
      setMessage(messageDefault);
    }, 2000);
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<{ courses: ICourse[] }>(API_BASE_URL);
      setCourses(data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setMessage({
        message: "Failed to fetch courses, please try again later.",
        isError: true,
      });
    } finally {
      setLoading(false);
      resetMessage();
    }
  }, [resetMessage]);

  const addCourse = useCallback(
    async (newCourseName: string) => {
      if (!newCourseName.trim()) return;
      try {
        const { data } = await axios.post<{ courses: ICourse[] }>(
          API_BASE_URL,
          {
            f_CourseName: newCourseName,
          }
        );
        setCourses(data.courses);
        setMessage({
          message: "Course added successfully",
          isError: false,
        });
      } catch (error: any) {
        console.error("Error adding course:", error);
        setMessage({
          message: error.response?.data?.message || "Failed to add course",
          isError: true,
        });
      } finally {
        resetMessage();
      }
    },
    [resetMessage]
  );

  const deleteCourse = useCallback(
    async (courseId: string) => {
      try {
        const { data } = await axios.delete<{ courses: ICourse[] }>(
          API_BASE_URL,
          { data: { courseId } }
        );
        setCourses(data.courses);
        setMessage({
          message: "Course deleted successfully",
          isError: false,
        });
      } catch (error: any) {
        console.error("Error deleting course:", error);
        setMessage({
          message: error.response?.data?.message || "Failed to delete course",
          isError: true,
        });
      } finally {
        resetMessage();
      }
    },
    [resetMessage]
  );

  const updateCourse = useCallback(
    async (courseId: string, newCourseName: string) => {
      try {
        const { data } = await axios.put<{ courses: ICourse[] }>(API_BASE_URL, {
          oldCourseId: courseId,
          newCourseName,
        });
        setCourses(data.courses);
        setMessage({
          message: "Course updated successfully",
          isError: false,
        });
      } catch (error: any) {
        console.error("Error updating course:", error);
        setMessage({
          message: error.response?.data?.message || "Failed to update course",
          isError: true,
        });
      } finally {
        resetMessage();
      }
    },
    [resetMessage]
  );

  const sortCourses = useCallback((courses: ICourse[]) => {
    return [...courses].sort((a, b) =>
      a.f_CourseName.localeCompare(b.f_CourseName)
    );
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        message,
        fetchCourses,
        addCourse,
        deleteCourse,
        updateCourse,
        sortCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};
