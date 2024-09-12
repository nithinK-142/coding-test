import { AuthContext, AuthContextProvider } from "./context/auth-context";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useContext } from "react";
import { Box } from "@mui/material";
import BreadCrumbs from "./components/BreadCrumbs";
import { PathContextProvider } from "./context/path-context";
import Navbar from "./components/Navbar";

function AuthenticatedApp() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      {isAuthenticated && <Sidebar />}
      <Box
        sx={{
          flex: 1,
          marginLeft: isAuthenticated ? 30 : 0,
          // padding: isAuthenticated ? 2 : 0,
          // paddingTop: 0,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isAuthenticated && <Navbar />}
        <Box
          sx={{
            padding: isAuthenticated ? 2 : 0,
            paddingBlock: isAuthenticated ? 3 : 0,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {isAuthenticated && <BreadCrumbs />}
          <Box
            sx={{
              flex: 1,
              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              padding: isAuthenticated ? 2 : 0,
              // padding: 3,
              backgroundColor: isAuthenticated ? "white" : "#2c3e50",
              marginTop: isAuthenticated ? 1 : 0,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <PathContextProvider>
        <AuthenticatedApp />
      </PathContextProvider>
    </AuthContextProvider>
  );
}

export default App;
