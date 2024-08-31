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

interface ICourseContext {
  courses: ICourse[];
  loading: boolean;
  error: string;
  fetchCourses: () => Promise<void>;
  addCourse: (newCourseName: string) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  updateCourse: (courseId: string, newCourseName: string) => Promise<void>;
  sortCourses: (courses: ICourse[]) => ICourse[];
}

const CourseContext = createContext<ICourseContext>({
  courses: [],
  loading: false,
  error: "",
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
  const [error, setError] = useState<string>("");

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<{ courses: ICourse[] }>(API_BASE_URL);
      setCourses(data.courses);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  }, []);

  const addCourse = useCallback(async (newCourseName: string) => {
    if (!newCourseName.trim()) return;
    try {
      const { data } = await axios.post<{ courses: ICourse[] }>(API_BASE_URL, {
        f_CourseName: newCourseName,
      });
      setCourses(data.courses);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to add course");
    } finally {
      setTimeout(() => setError(""), 2000);
    }
  }, []);

  const deleteCourse = useCallback(async (courseId: string) => {
    try {
      const { data } = await axios.delete<{ courses: ICourse[] }>(
        API_BASE_URL,
        { data: { courseId } }
      );
      setCourses(data.courses);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to delete course");
    } finally {
      setTimeout(() => setError(""), 2000);
    }
  }, []);

  const updateCourse = useCallback(
    async (courseId: string, newCourseName: string) => {
      try {
        const { data } = await axios.put<{ courses: ICourse[] }>(API_BASE_URL, {
          oldCourseId: courseId,
          newCourseName,
        });
        setCourses(data.courses);
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to update course");
      } finally {
        setTimeout(() => setError(""), 2000);
      }
    },
    []
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
        error,
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
  if (context === undefined) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};
