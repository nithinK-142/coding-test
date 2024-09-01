import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IEmployee } from "./EmployeeList";
import { useCourseContext } from "@/context/course-context";

export default function CreateEmployee() {
  const navigate = useNavigate();
  const { courses, sortCourses } = useCourseContext();

  const [employee, setEmployee] = useState<
    Omit<IEmployee, "_id" | "f_Course" | "f_CreatedAt">
  >({
    f_Image: "",
    f_Name: "",
    f_Email: "",
    f_Mobile: "",
    f_Designation: "",
    f_Gender: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only JPG/PNG files are allowed");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setSelectedFileName("");
    setPreviewUrl(null);
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCourses([...selectedCourses, value]);
    } else {
      setSelectedCourses(
        selectedCourses.filter((courseId) => courseId !== value)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("f_Name", employee.f_Name);
    formData.append("f_Email", employee.f_Email);
    formData.append("f_Mobile", employee.f_Mobile);
    formData.append("f_Designation", employee.f_Designation);
    formData.append("f_Gender", employee.f_Gender);
    formData.append("f_Course", JSON.stringify(selectedCourses));
    if (selectedFile) {
      formData.append("f_Image", selectedFile);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      navigate("/employees-list");
    } catch (error: any) {
      setError(error.response.data.errors[0].msg);
      alert(error.response.data.errors[0].msg);
      console.error(error.response.data.errors[0].msg);
    } finally {
      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {error && (
        <div className="p-2 text-white bg-red-500 rounded-md">{error}</div>
      )}
      <h1 className="mb-4 text-2xl font-bold">Create Employee</h1>
      {previewUrl && (
        <div className="mb-4 rounded-full h-32 w-32 relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 object-cover rounded-full"
          />
          <button
            onClick={handleRemoveFile}
            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
          >
            <span className="text-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </span>
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">
            Name:
            <input
              type="text"
              name="f_Name"
              value={employee.f_Name}
              onChange={handleInputChange}
              className="w-full p-2 text-black border border-gray-300 rounded"
              placeholder="employee name"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Email:
            <input
              type="email"
              name="f_Email"
              value={employee.f_Email}
              onChange={handleInputChange}
              className="w-full p-2 text-black border border-gray-300 rounded"
              placeholder="employee email"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Mobile No:
            <input
              type="text"
              name="f_Mobile"
              value={employee.f_Mobile}
              onChange={handleInputChange}
              className="w-full p-2 text-black border border-gray-300 rounded"
              placeholder="mobile number"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Designation:
            <select
              name="f_Designation"
              value={employee.f_Designation}
              onChange={handleInputChange}
              className="w-full p-2 text-black border border-gray-300 rounded"
            >
              <option value="" hidden>
                Select Designation
              </option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Course:</label>
          <div className="flex">
            {sortCourses(courses).map((course) => (
              <label key={course._id} className="mr-4">
                <input
                  type="checkbox"
                  name="f_Course"
                  value={course._id}
                  onChange={handleCourseChange}
                  className="mr-2"
                />
                {course.f_CourseName}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Gender:
            <div className="flex">
              <label className="mr-4">
                <input
                  type="radio"
                  name="f_Gender"
                  value="Male"
                  checked={employee.f_Gender === "Male"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="f_Gender"
                  value="Female"
                  checked={employee.f_Gender === "Female"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Female
              </label>
            </div>
          </label>
        </div>

        <div className="mb-4">
          <label className="block mb-2">
            Img Upload:
            <input
              type="file"
              accept=".jpg,.png"
              onChange={handleFileChange}
              className="w-full p-2 text-black border border-gray-300 rounded"
            />
          </label>
          {selectedFileName && (
            <p className="text-sm text-gray-500">
              Selected file: {selectedFileName}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}
