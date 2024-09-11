import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import {
  ShoppingCart,
  DeliveryDining,
  FiberManualRecord,
  WebStories,
  Widgets,
  ExitToApp,
} from "@mui/icons-material";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth-context";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const handleSubMenuClick = (menu: string) => {
    setActiveSubMenu(menu);
  };
  return (
    <Box
      sx={{
        width: 250,
        height: "100%",
        backgroundColor: "#152238",
        color: "#ecf0f1",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ProSidebar>
        <Box sx={{ padding: 2, backgroundColor: "#152238" }}>
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
        <Menu style={{ color: "#ecf0f1", backgroundColor: "#152238" }}>
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
                  fontSize: "8px",
                  marginRight: "4px",
                  marginLeft: "6px",
                }}
              />
              <span style={{ fontSize: "16px" }}>Order</span>
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
                  fontSize: "8px",
                  marginRight: "4px",
                  marginLeft: "6px",
                }}
              />
              <span style={{ fontSize: "16px" }}>Bad Orders</span>
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
                  fontSize: "8px",
                  marginRight: "4px",
                  marginLeft: "6px",
                }}
              />
              <span style={{ fontSize: "16px" }}>Delivery</span>
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
                  fontSize: "8px",
                  marginRight: "4px",
                  marginLeft: "6px",
                }}
              />
              <span style={{ fontSize: "16px" }}>Bad Delivery</span>
            </MenuItem>
          </SubMenu>

          {/* Logout button */}
          <MenuItem
            icon={<ExitToApp />}
            onClick={logout}
            style={{
              backgroundColor: "transparent",
              marginTop: "auto",
            }}
          >
            Logout
          </MenuItem>

          {/* <SubMenu
            icon={<Settings />}
            label="Settings"
            style={{ backgroundColor: "transparent" }}
          >
            <MenuItem
              component={<Link to="/profile" />}
              style={{
                backgroundColor:
                  activeSubMenu === "profile" ? "#161f28" : "#152238",
              }}
              onClick={() => handleSubMenuClick("profile")}
            >
              Profile
            </MenuItem>
            <MenuItem
              component={<Link to="/preferences" />}
              style={{
                backgroundColor:
                  activeSubMenu === "preferences" ? "#161f28" : "#152238",
              }}
              onClick={() => handleSubMenuClick("preferences")}
            >
              Preferences
            </MenuItem>
          </SubMenu> */}
        </Menu>
      </ProSidebar>
    </Box>
  );
}
