import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/v1/courses";

interface ICourseContext {
  courses: string[];
  loading: boolean;
  error: string;
  fetchCourses: () => Promise<void>;
  addCourse: (newCourse: string) => Promise<void>;
  deleteCourse: (course: string) => Promise<void>;
  updateCourse: (oldCourse: string, newCourse: string) => Promise<void>;
  sortCourses: (coursesArray: string[]) => string[];
}

const CourseContext = createContext<ICourseContext>({
  courses: [],
  loading: false,
  error: "",
  fetchCourses: () => Promise.resolve(),
  addCourse: () => Promise.resolve(),
  deleteCourse: () => Promise.resolve(),
  updateCourse: () => Promise.resolve(),
  sortCourses: () => [],
});

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const sortCourses = (coursesArray: string[]): string[] => {
    return [...coursesArray].sort((a, b) => a.localeCompare(b));
  };

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_BASE_URL);
      setCourses(data.courses);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  }, []);

  const addCourse = useCallback(async (newCourse: string) => {
    if (!newCourse.trim()) return;
    try {
      const { data } = await axios.post(API_BASE_URL, { course: newCourse });
      setCourses(data.courses);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to add course");
    } finally {
      setTimeout(() => setError(""), 2000);
    }
  }, []);

  const deleteCourse = useCallback(async (course: string) => {
    try {
      const { data } = await axios.delete(API_BASE_URL, { data: { course } });
      setCourses(data.courses);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to delete course");
    } finally {
      setTimeout(() => setError(""), 2000);
    }
  }, []);

  const updateCourse = useCallback(
    async (oldCourse: string, newCourse: string) => {
      try {
        const { data } = await axios.put(API_BASE_URL, {
          oldCourse,
          newCourse,
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

  useEffect(() => {
    fetchCourses();
  }, []);

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
