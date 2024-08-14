import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  function handleLogout() {}

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) navigate("/login");
    else setUsername(username);
  });

  return (
    <nav className="flex py-6 px-20 outline justify-between gap-40">
      <div className="flex justify-between w-1/3">
        <Link to={"/"}>Home</Link>
        <Link to={"/employees-list"}>EmployeesList</Link>
      </div>
      <div className="1/2"></div>
      <div className="flex justify-between w-1/3">
        <h3>{username}</h3>
        <button onClick={handleLogout}>logout</button>
      </div>
    </nav>
  );
}
