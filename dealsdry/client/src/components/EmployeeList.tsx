import { Link } from "react-router-dom";
import { useEmployeeContext } from "@/context/employee-context";
import { colNames } from "@/constants";

export default function EmployeeList() {
  const { employees, deleteEmployee } = useEmployeeContext();

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id);
      alert("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    }
  };

  return (
    <div>
      <div className="flex justify-center gap-[10rem] py-4">
        <div className="px-2 py-1.5 rounded-md bg-stone-600">
          Employees:{employees.length}
        </div>
        <Link
          to="/create-employee"
          className="px-4 py-1.5 hover:bg-white rounded-md hover:transition-colors hover:duration-500 hover:text-black hover:ease-in-out"
        >
          Create Employee
        </Link>
      </div>
      <div>
        <table className="min-w-full bg-gray-600 border border-gray-300">
          <thead>
            <tr>
              {colNames.map((col) => (
                <th className="px-4 py-2 border-b">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={employee._id}>
                <td className="px-4 py-2 text-center border-b">{index + 1}</td>
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
                  {employee.f_Gender}
                </td>
                <td className="px-4 py-2 text-center border-b">
                  {employee.f_Course
                    .map((course) => course.f_CourseName)
                    .join(", ")}
                </td>
                <td className="px-4 py-2 text-center border-b">
                  {new Date(employee.f_CreatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b">
                  <div className="flex justify-center space-x-4">
                    <Link
                      to={`/edit-employee/${employee._id}`}
                      className="hover:bg-yellow-500 px-2 rounded-md"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="hover:bg-red-500 px-2 rounded-md"
                    >
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
