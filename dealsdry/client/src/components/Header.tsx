import { navLinks } from "@/constants";
import { AuthContext } from "@/context/auth-context";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useContext(AuthContext);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) navigate("/login");
    else setUsername(username);
  }, [navigate]);

  return (
    <nav className="flex justify-between gap-40 px-20 py-6 border">
      {navLinks.map((link) => (
        <Link
          to={link.path}
          className={`${
            pathname === link.path
              ? "font-bold underline underline-offset-4 opacity-100"
              : "opacity-80"
          }`}
        >
          {link.name}
        </Link>
      ))}
      <h3
        className="px-3 rounded-tl-xl rounded-bl-xl rounded-br-xl rounded-tr-xl bg-green-600"
        title="admin"
      >
        {username}
      </h3>
      <button onClick={logout}>logout</button>
    </nav>
  );
}
