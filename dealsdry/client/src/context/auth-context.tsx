import { createContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface IAuthContext {
  isAuthenticated: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const defaultVal: IAuthContext = {
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<IAuthContext>(defaultVal);

export const AuthContextProvider = (props: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("token") !== null &&
      localStorage.getItem("username") !== null
  );
  const navigate = useNavigate();

  const login = useCallback((token: string, username: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setIsAuthenticated(true);
    navigate("/dashboard");
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    navigate("/login");
  }, []);

  const contextValue: IAuthContext = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
