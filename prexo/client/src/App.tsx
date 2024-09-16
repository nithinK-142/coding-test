import { AuthContext, AuthContextProvider } from "./context/auth-context";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useContext } from "react";
import { Box } from "@mui/material";
import BreadCrumbs from "./components/BreadCrumbs";
import { PathContext, PathContextProvider } from "./context/path-context";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ResultDialogProvider } from "./context/ResultDialogContext";
import { OrderSheetUploadedProvider } from "./context/OrderSheetUploadedContext";

function AuthenticatedApp() {
  const { isAuthenticated } = useContext(AuthContext);
  const { pathName } = useContext(PathContext);

  const isDashboard = pathName === "/";

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
          position: "relative",
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
          {isAuthenticated && !isDashboard && <BreadCrumbs />}
          {isDashboard ? (
            <Outlet />
          ) : (
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
          )}
        </Box>
        {isAuthenticated && <Footer />}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <PathContextProvider>
        <OrderSheetUploadedProvider>
          <ResultDialogProvider>
            <AuthenticatedApp />
          </ResultDialogProvider>
        </OrderSheetUploadedProvider>
      </PathContextProvider>
    </AuthContextProvider>
  );
}

export default App;
