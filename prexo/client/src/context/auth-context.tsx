import axios from "axios";
import { createContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface IAuthContext {
  isAuthenticated: boolean;
  login: (credentials: { f_UserName: string; f_Pwd: string }) => void;
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

  const login = useCallback(
    async (credentials: { f_UserName: string; f_Pwd: string }) => {
      const { data } = await axios.post(
        import.meta.env.VITE_API_URL + "/login",
        credentials
      );
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      setIsAuthenticated(true);
      navigate("/");
    },
    []
  );

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
