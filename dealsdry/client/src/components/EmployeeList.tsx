import { Link } from "react-router-dom";
import { useEmployeeContext } from "@/context/employee-context";

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
        <div>Total count: {employees.length}</div>
        <Link to="/create-employee">Create Employee</Link>
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
              <th className="px-4 py-2 border-b">Courses</th>
              <th className="px-4 py-2 border-b">Created Date</th>
              <th className="px-4 py-2 border-b">Action</th>
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
                    <Link to={`/edit-employee/${employee._id}`}>Edit</Link>
                    <button onClick={() => handleDelete(employee._id)}>
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
