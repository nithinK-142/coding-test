import { AuthContext } from "../context/auth-context";
import { ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !isAuthenticated ||
      !localStorage.getItem("token") ||
      !localStorage.getItem("username")
    ) {
      navigate("/login");
    }
  }, []);

  return children;
}
