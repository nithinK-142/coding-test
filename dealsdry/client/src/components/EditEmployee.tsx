import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IEmployee } from "./EmployeeList";

export default function EditEmployee() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => {
    async function getEmployeeDetails() {
      try {
        const { data } = await axios.get<IEmployee>(
          `${import.meta.env.VITE_API_URL}/${id}`
        );
        setEmployee(data);
        setSelectedCourses(data.f_Course.split(","));
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
    if (employee) {
      formData.append("f_Id", employee.f_Id.toString());
      formData.append("f_Name", employee.f_Name);
      formData.append("f_Email", employee.f_Email);
      formData.append("f_Mobile", employee.f_Mobile);
      formData.append("f_Designation", employee.f_Designation);
      formData.append("f_gender", employee.f_gender);
      formData.append("f_Course", selectedCourses.join(","));
      if (selectedFile) {
        formData.append("f_Image", selectedFile);
      }
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    console.log(formData);
    try {
      await axios.put(
        `http://localhost:3001/api/v1/employees/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Edit Employee</h1>
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
                checked={selectedCourses.includes("MCA")}
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
                checked={selectedCourses.includes("BCA")}
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
                checked={selectedCourses.includes("BSC")}
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
          </label>
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

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { IEmployee } from "./EmployeeList";

// export default function EditEmployee() {
//   const { id } = useParams<{ id: string }>();
//   const [employee, setEmployee] = useState<IEmployee | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   async function getEmployeeDetails() {
//     try {
//       const { data } = await axios.get<IEmployee>(
//         `http://localhost:3001/api/v1/employees/${id}`
//       );
//       setEmployee(data);
//     } catch (error) {
//       setError("Failed to fetch employee details.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     getEmployeeDetails();
//   }, [id]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!employee) {
//     return <div>No employee found.</div>;
//   }

//   return (
//     <div className="container p-4 mx-auto">
//       <h1 className="mb-4 text-2xl font-bold">Edit Employee</h1>
//       <div className="flex items-center mb-4">
//         <img
//           src={employee.f_Image}
//           alt={employee.f_Name}
//           className="object-cover w-24 h-24 mr-4 rounded-full"
//         />
//         <div>
//           <h2 className="text-xl font-semibold">{employee.f_Name}</h2>
//           <p className="text-gray-600">{employee.f_Email}</p>
//           <p className="text-gray-600">{employee.f_Mobile}</p>
//         </div>
//       </div>
//       <div>
//         <p>
//           <strong>Designation:</strong> {employee.f_Designation}
//         </p>
//         <p>
//           <strong>Gender:</strong> {employee.f_gender}
//         </p>
//         <p>
//           <strong>Course:</strong> {employee.f_Course}
//         </p>
//         <p>
//           <strong>Created Date:</strong>{" "}
//           {new Date(employee.f_Createdate).toLocaleDateString()}
//         </p>
//       </div>
//     </div>
//   );
// }
