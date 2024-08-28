import { AuthContext } from "@/context/auth-context";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [username, setUsername] = useState<string>("");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) navigate("/login");
    else setUsername(username);
  }, [navigate]);

  return (
    <nav className="flex justify-between gap-40 px-20 py-6 border">
      <div className="flex justify-between w-1/3">
        <Link to={"/dashboard"}>Dashboard</Link>
        <Link to={"/employees-list"}>EmployeesList</Link>
      </div>
      <Link to={"/course-list"}>CourseList</Link>
      <div className="1/2"></div>
      <div className="flex justify-between w-1/3">
        <h3>{username}</h3>
        <button onClick={logout}>logout</button>
      </div>
    </nav>
  );
}
