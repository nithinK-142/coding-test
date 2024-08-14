import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface IEmployee {
  f_Id: number;
  f_Image: string;
  f_Name: string;
  f_Email: string;
  f_Mobile: string;
  f_Designation: string;
  f_gender: string;
  f_Course: string;
  f_Createdate: Date;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  async function getEmployees() {
    try {
      const { data } = await axios.get(
        "http://localhost:3001/api/v1/employees"
      );

      setEmployees(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id: number) {
    try {
      const { data } = await axios.delete(
        `http://localhost:3001/api/v1/employees/${id}`
      );
      getEmployees();
      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <div>
      <div className="flex justify-center gap-[10rem] py-4">
        <div>Totalcount: {employees.length}</div>
        <Link to={"/create-employee"}>Create Employee</Link>
      </div>
      <div>
        <table className="min-w-full bg-gray-600 border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Mobile</th>
              <th className="py-2 px-4 border-b">Designation</th>
              <th className="py-2 px-4 border-b">Gender</th>
              <th className="py-2 px-4 border-b">Course</th>
              <th className="py-2 px-4 border-b">Created Date</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.f_Id}>
                <td className="py-2 px-4 border-b text-center">
                  {employee.f_Id}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <img
                    src={employee.f_Image}
                    alt={employee.f_Name}
                    className="h-10 w-10 object-cover rounded-full mx-auto"
                  />
                </td>
                <td className="py-2 px-4 border-b">{employee.f_Name}</td>
                <td className="py-2 px-4 border-b">{employee.f_Email}</td>
                <td className="py-2 px-4 border-b">{employee.f_Mobile}</td>
                <td className="py-2 px-4 border-b">{employee.f_Designation}</td>
                <td className="py-2 px-4 border-b">{employee.f_gender}</td>
                <td className="py-2 px-4 border-b">{employee.f_Course}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(employee.f_Createdate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex space-x-4">
                    <Link to={`/edit-employee/${employee.f_Id}`}>Edit</Link>
                    <button onClick={() => handleDelete(employee.f_Id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
