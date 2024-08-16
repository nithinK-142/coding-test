import { Outlet } from "react-router-dom";
import { useContext } from "react";
import Header from "./components/Header";
import { AuthContext, AuthContextProvider } from "./context/auth-context";

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
      <AuthenticatedApp />
    </AuthContextProvider>
  );
}

export default App;
