import { Outlet } from "react-router-dom";
import { useContext } from "react";
import Header from "./components/Header";
import { AuthContext, AuthContextProvider } from "./context/auth-context";
import { CourseProvider } from "./context/course-context";
import { EmployeeProvider } from "./context/employee-context";

function AuthenticatedApp() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <>
      {isAuthenticated && <Header />}
      <Outlet />
    </>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <CourseProvider>
        <EmployeeProvider>
          <AuthenticatedApp />
        </EmployeeProvider>
      </CourseProvider>
    </AuthContextProvider>
  );
}

export default App;
