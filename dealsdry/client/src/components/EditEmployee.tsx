import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IEmployee } from "./EmployeeList";
// import { COURSE_LIST } from "@/constants/cources";

export default function EditEmployee() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [imageDeleted, setImageDeleted] = useState(false);

  const [courses, setCourses] = useState<string[]>([]);
  useEffect(() => {
    const getCourses = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/v1/courses`
        );
        console.log(data[0].courses);
        setCourses(data[0].courses.split(","));
      } catch (error) {
        console.error(error);
        setError("Failed to add course");
      }
    };
    getCourses();
  }, []);

  useEffect(() => {
    async function getEmployeeDetails() {
      try {
        const { data } = await axios.get<IEmployee>(
          `${import.meta.env.VITE_API_URL}/${id}`
        );
        setEmployee(data);
        setSelectedCourses(data.f_Course.split(",").sort());
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
      setImageDeleted(false);
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
    setImageDeleted(true);
    setSelectedFile(null);
    setSelectedFileName("");
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
    formData.append("f_Id", employee.f_Id.toString());
    formData.append("f_Name", employee.f_Name);
    formData.append("f_Email", employee.f_Email);
    formData.append("f_Mobile", employee.f_Mobile);
    formData.append("f_Designation", employee.f_Designation);
    formData.append("f_gender", employee.f_gender);
    formData.append("f_Course", selectedCourses.join(","));
    if (selectedFile) {
      formData.append("f_Image_file", selectedFile);
    }
    if (imageDeleted) {
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

  // const combinedCourses = Array.from(
  //   new Set([...COURSE_LIST, ...selectedCourses])
  // ).sort();

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Employee</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mb-4">
          {employee.f_Image ===
            "https://demofree.sirv.com/nope-not-here.jpg" && (
            <p className="text-red-500">No Image</p>
          )}

          {!imageDeleted &&
            employee.f_Image &&
            employee.f_Image !==
              "https://demofree.sirv.com/nope-not-here.jpg" && (
              <>
                <img
                  src={employee.f_Image}
                  alt={employee.f_Name}
                  className="object-cover w-16 h-16 mb-2 rounded-full"
                />

                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="px-2 py-1 text-white bg-red-500 rounded"
                  disabled={imageDeleted || !employee.f_Image}
                >
                  Delete Image
                </button>
              </>
            )}
        </div>
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
            {courses.map((course) => (
              <label key={course} className="mr-4">
                <input
                  type="checkbox"
                  name="f_Course"
                  value={course}
                  checked={selectedCourses.includes(course)}
                  onChange={handleCourseChange}
                  className="mr-2"
                />
                {course}
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <Link to={`/cource-list`} className="p-2 bg-green-600 rounded-md">
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
                  name="f_gender"
                  value="Male"
                  checked={employee.f_gender === "Male"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="f_gender"
                  value="Female"
                  checked={employee.f_gender === "Female"}
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
