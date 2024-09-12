import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import {
  ShoppingCart,
  DeliveryDining,
  FiberManualRecord,
  WebStories,
  Widgets,
  ExitToApp,
} from "@mui/icons-material";
import { SetStateAction, useContext, useState } from "react";
import { AuthContext } from "../context/auth-context";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const [activeSubMenu, setActiveSubMenu] = useState<
    string | SetStateAction<null>
  >(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleSubMenuClick = (menu: string | SetStateAction<null>) => {
    setActiveSubMenu(menu);
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleConfirmLogout = () => {
    handleCloseLogoutDialog();
    logout();
  };

  return (
    <>
      <ProSidebar>
        <Box sx={{ padding: 4, backgroundColor: "#152238" }}>
          <Typography
            variant="h6"
            sx={{
              color: "#ecf0f1",
              display: "flex",
              alignItems: "center",
            }}
          >
            <WebStories />
            Prexo
          </Typography>
        </Box>
        <Menu
          style={{
            color: "#ecf0f1",
            backgroundColor: "#152238",
            fontSize: "12px",
          }}
        >
          <MenuItem
            icon={<Widgets />}
            component={<Link to="/" />}
            style={{
              backgroundColor:
                activeSubMenu === "dashboard" ? "#161f28" : "#152238",
            }}
            onClick={() => handleSubMenuClick("dashboard")}
          >
            Dashboard
          </MenuItem>

          <div
            style={{
              paddingTop: "1rem",
              paddingLeft: "1rem",
              paddingRight: "0.5rem",
            }}
          >
            Pages
          </div>
          <SubMenu
            icon={<ShoppingCart />}
            label="Orders"
            style={{ backgroundColor: "transparent" }}
          >
            <MenuItem
              component={<Link to="/order/bulk-import" />}
              style={{
                backgroundColor:
                  activeSubMenu === "order" ? "#161f28" : "#152238",
              }}
              onClick={() => handleSubMenuClick("order")}
            >
              <FiberManualRecord
                style={{
                  fontSize: "6px",
                  marginRight: "8px",
                  marginLeft: "6px",
                }}
              />
              <span>Order</span>
            </MenuItem>
            <MenuItem
              component={<Link to="/order/bad-orders" />}
              style={{
                backgroundColor:
                  activeSubMenu === "bad-orders" ? "#161f28" : "#152238",
              }}
              onClick={() => handleSubMenuClick("bad-orders")}
            >
              <FiberManualRecord
                style={{
                  fontSize: "6px",
                  marginRight: "8px",
                  marginLeft: "6px",
                }}
              />
              <span>Bad Orders</span>
            </MenuItem>
          </SubMenu>

          <SubMenu
            icon={<DeliveryDining />}
            label="Delivery"
            style={{ backgroundColor: "transparent" }}
          >
            <MenuItem
              component={<Link to="/delivery/bulk-import" />}
              style={{
                backgroundColor:
                  activeSubMenu === "delivery" ? "#161f28" : "#152238",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => handleSubMenuClick("delivery")}
            >
              <FiberManualRecord
                style={{
                  fontSize: "6px",
                  marginRight: "8px",
                  marginLeft: "6px",
                }}
              />
              <span>Delivery</span>
            </MenuItem>
            <MenuItem
              component={<Link to="/delivery/bad-delivery" />}
              style={{
                backgroundColor:
                  activeSubMenu === "bad-delivery" ? "#161f28" : "#152238",
              }}
              onClick={() => handleSubMenuClick("bad-delivery")}
            >
              <FiberManualRecord
                style={{
                  fontSize: "6px",
                  marginRight: "8px",
                  marginLeft: "6px",
                }}
              />
              <span>Bad Delivery</span>
            </MenuItem>
          </SubMenu>

          {/* Logout button */}
          <MenuItem
            icon={<ExitToApp />}
            onClick={handleLogoutClick}
            style={{
              backgroundColor: "transparent",
              marginTop: "auto",
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </ProSidebar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog}>Cancel</Button>
          <Button onClick={handleConfirmLogout} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
