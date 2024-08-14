import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token") || !localStorage.getItem("username")) {
      navigate("/login");
    }
  }, []);
  return children;
}
