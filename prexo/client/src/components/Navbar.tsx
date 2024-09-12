import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { useContext } from "react";
import { PathContext } from "../context/path-context";

export default function Navbar() {
  function capitalizeText(text: string) {
    return text.toUpperCase();
  }
  const { pathnames } = useContext(PathContext);

  console.log(pathnames);

  const isSuperAdmin = pathnames.includes("Bag");
  return (
    <Box>
      <AppBar
        position="static"
        sx={{ borderRadius: "8px", backgroundColor: "#fff", color: "#000" }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: "14px",
              fontWeight: "bold",
              opacity: 0.8,
            }}
          >
            {capitalizeText(
              isSuperAdmin ? "Super Admin Panel" : "Processing MIS Panel"
            )}
          </Typography>
          {/* User avatar with name */}
          <Stack direction="row" spacing={1} alignItems="center">
            <span style={{ opacity: 0.8 }}>Hi, </span>
            <Typography
              variant="body1"
              sx={{ fontWeight: "medium", letterSpacing: "-0.025em" }}
            >
              {isSuperAdmin ? "Sup Admin" : "John Doe"}
            </Typography>
            <Avatar sx={{ bgcolor: "#1976d2", height: 32, width: 32 }}>
              MIS
            </Avatar>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
