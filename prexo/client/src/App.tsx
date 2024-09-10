import { AuthContext, AuthContextProvider } from "./context/auth-context";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useContext } from "react";

function AuthenticatedApp() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <div className="app-container">
      {isAuthenticated && <Sidebar />}
      <main>
        <Outlet />
      </main>
    </div>
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
