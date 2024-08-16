import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IEmployee } from "./EmployeeList";

export default function CreateEmployee() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<IEmployee>({
    f_Id: 0,
    f_Image: "",
    f_Name: "",
    f_Email: "",
    f_Mobile: "",
    f_Designation: "HR",
    f_gender: "Male",
    f_Course: "",
    f_Createdate: new Date(),
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [, setError] = useState<string | null>(null);

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
    } else {
      alert("Only JPG/PNG files are allowed");
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCourses([...selectedCourses, value]);
    } else {
      setSelectedCourses(selectedCourses.filter((course) => course !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("f_Name", employee.f_Name);
    formData.append("f_Email", employee.f_Email);
    formData.append("f_Mobile", employee.f_Mobile);
    formData.append("f_Designation", employee.f_Designation);
    formData.append("f_gender", employee.f_gender);
    formData.append("f_Course", selectedCourses.join(","));
    if (selectedFile) {
      formData.append("f_Image_file", selectedFile);
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
    } catch (error) {
      setError("Failed to create employee.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Create Employee</h1>
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
          <div className="flex">
            <label className="mr-4">
              <input
                type="checkbox"
                name="f_Course"
                value="MCA"
                onChange={handleCourseChange}
                className="mr-2"
              />
              MCA
            </label>
            <label className="mr-4">
              <input
                type="checkbox"
                name="f_Course"
                value="BCA"
                onChange={handleCourseChange}
                className="mr-2"
              />
              BCA
            </label>
            <label>
              <input
                type="checkbox"
                name="f_Course"
                value="BSC"
                onChange={handleCourseChange}
                className="mr-2"
              />
              BSC
            </label>
          </div>
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
          </label>{" "}
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
