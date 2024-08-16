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
      const { data } = await axios.get(import.meta.env.VITE_API_URL);

      setEmployees(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id: number) {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/${id}`
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
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Image</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Mobile</th>
              <th className="px-4 py-2 border-b">Designation</th>
              <th className="px-4 py-2 border-b">Gender</th>
              <th className="px-4 py-2 border-b">Course</th>
              <th className="px-4 py-2 border-b">Created Date</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.f_Id}>
                <td className="px-4 py-2 text-center border-b">
                  {employee.f_Id}
                </td>
                <td className="px-4 py-2 text-center border-b">
                  <img
                    src={employee.f_Image}
                    alt={employee.f_Name}
                    className="object-cover w-10 h-10 mx-auto rounded-full"
                  />
                </td>
                <td className="px-4 py-2 text-center border-b">
                  {employee.f_Name}
                </td>
                <td className="px-4 py-2 text-center border-b">
                  {employee.f_Email}
                </td>
                <td className="px-4 py-2 text-center border-b">
                  {employee.f_Mobile}
                </td>
                <td className="px-4 py-2 text-center border-b">
                  {employee.f_Designation}
                </td>
                <td className="px-4 py-2 text-center border-b">
                  {employee.f_gender}
                </td>
                <td className="px-4 py-2 text-center border-b">
                  {employee.f_Course}
                </td>
                <td className="px-4 py-2 text-center border-b">
                  {new Date(employee.f_Createdate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b">
                  <div className="flex justify-center space-x-4">
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
