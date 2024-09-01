import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IEmployee } from "./EmployeeList";
import { useCourseContext } from "@/context/course-context";

export default function EditEmployee() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { courses, sortCourses } = useCourseContext();
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarState, setAvatarState] = useState<
    "existing" | "new" | "deleted"
  >("existing");

  useEffect(() => {
    async function getEmployeeDetails() {
      try {
        const { data } = await axios.get<{ employee: IEmployee }>(
          `${import.meta.env.VITE_API_URL}/${id}`
        );
        setEmployee(data.employee);
        setSelectedCourses(data.employee.f_Course.map((course) => course._id));
        setPreviewUrl(data.employee.f_Image);
        setAvatarState(
          data.employee.f_Image ===
            "https://demofree.sirv.com/nope-not-here.jpg"
            ? "deleted"
            : "existing"
        );
      } catch (error) {
        setError("Failed to fetch employee details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getEmployeeDetails();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (employee) {
      const { name, value } = e.target;
      setEmployee({ ...employee, [name]: value });
    }
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
      setAvatarState("new");
    } else {
      alert("Only JPG/PNG files are allowed");
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCourses((prev) => [...prev, value].sort());
    } else {
      setSelectedCourses((prev) =>
        prev.filter((course) => course !== value).sort()
      );
    }
  };

  const handleDeleteImage = () => {
    setSelectedFile(null);
    setSelectedFileName("");
    setPreviewUrl(null);
    setAvatarState("deleted");
    if (employee) {
      setEmployee({ ...employee, f_Image: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employee) {
      setError("No employee data available.");
      return;
    }

    const formData = new FormData();
    formData.append("f_Name", employee.f_Name);
    formData.append("f_Email", employee.f_Email);
    formData.append("f_Mobile", employee.f_Mobile);
    formData.append("f_Designation", employee.f_Designation);
    formData.append("f_Gender", employee.f_Gender);
    formData.append("f_Course", JSON.stringify(selectedCourses));
    formData.append(
      "avatarState",
      avatarState === "deleted" ? "true" : "false"
    );
    if (selectedFile) {
      formData.append("f_Image", selectedFile);
    }
    if (avatarState === "deleted") {
      formData.append("delete_image", "true");
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      navigate("/employees-list");
    } catch (error) {
      setError("Failed to update employee details.");
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!employee) {
    return <div>No employee found.</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Employee</h1>
      {avatarState === "deleted" && <p className="text-red-500">No Image</p>}
      {previewUrl && avatarState !== "deleted" && (
        <div className="mb-4 rounded-full h-32 w-32 relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full"
          />
          <button
            onClick={handleDeleteImage}
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
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Course:</label>
          <div className="flex flex-wrap">
            {sortCourses(courses).map((course) => (
              <label key={course._id} className="mr-4">
                <input
                  type="checkbox"
                  name="f_Course"
                  value={course._id}
                  checked={selectedCourses.includes(course._id)}
                  onChange={handleCourseChange}
                  className="mr-2"
                />
                {course.f_CourseName}
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <Link to={`/course-list`} className="p-2 bg-green-600 rounded-md">
            Add/Delete Course
          </Link>
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
          Update
        </button>
      </form>
    </div>
  );
}
