import { useContext, useState } from "react";
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
  Reorder,
  Class,
  PlayCircleOutline,
  TransferWithinAStation,
  SortRounded,
  AddShoppingCartRounded,
  FormatAlignRightRounded,
  CallMerge,
  Report,
  TrackChanges,
  ArtTrack,
  Assignment,
} from "@mui/icons-material";
import { AuthContext } from "../context/auth-context";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleSubMenuClick = (menu: string) => {
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
      <Box
        sx={{
          width: 240,
          height: "100%",
          backgroundColor: "#222942",
          color: "#ecf0f1",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflowY: "scroll", // Keep scroll functionality
          overflowX: "hidden", // Hide horizontal scrollbar
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari, and Opera
          },
        }}
      >
        <ProSidebar
          width="240px"
          style={{ paddingInline: "1rem", borderRight: "1px solid #222942" }}
        >
          <Box sx={{ padding: 2, backgroundColor: "#222942" }}>
            <Typography
              variant="h6"
              sx={{
                color: "#ecf0f1",
                display: "flex",
                alignItems: "center",
                fontSize: "1.2rem",
              }}
            >
              <WebStories sx={{ marginRight: 1 }} />
              Prexo
            </Typography>
          </Box>
          <Menu
            menuItemStyles={{
              button: {
                color: "#ecf0f1",
                backgroundColor: "#222942",
                paddingLeft: ".4rem",
                fontSize: "0.8rem",
                paddingTop: "0.4rem", // Reduced top padding
                paddingBottom: "0.4rem", // Reduced bottom padding
                "&:hover": {
                  backgroundColor: "#383e55",
                },
                // borderRadius: "8px",
              },
            }}
            rootStyles={{
              ".ps-submenu-expand-icon": {
                "& > *": {
                  width: "7px",
                  height: "7px",
                },
              },
            }}
          >
            <MenuItem
              icon={<Widgets style={{ fontSize: "16px" }} />}
              component={<Link to="/" />}
              active={activeSubMenu === "dashboard"}
              onClick={() => handleSubMenuClick("dashboard")}
            >
              Dashboard
            </MenuItem>

            <Typography
              sx={{
                paddingTop: "1rem",
                paddingBottom: "0.8rem",
                paddingLeft: "1rem",
                paddingRight: "0.5rem",
                fontSize: "0.75rem",
                backgroundColor: "#222942",
                color: "#ecf0f1",
              }}
            >
              <span style={{ opacity: 0.7 }}>PAGES</span>
            </Typography>

            <SubMenu
              icon={<Reorder style={{ fontSize: "18px" }} />}
              label="Orders"
            >
              <MenuItem
                component={<Link to="/order/bulk-import" />}
                active={activeSubMenu === "order"}
                onClick={() => handleSubMenuClick("order")}
                style={{
                  paddingLeft: "1.2rem",
                }}
              >
                <FiberManualRecord sx={{ fontSize: "0.5rem", mr: 1 }} />
                <span>Order</span>
              </MenuItem>
              <MenuItem
                component={<Link to="/order/bad-orders" />}
                active={activeSubMenu === "bad-orders"}
                onClick={() => handleSubMenuClick("bad-orders")}
                style={{
                  paddingLeft: "1.2rem",
                }}
              >
                <FiberManualRecord sx={{ fontSize: "0.5rem", mr: 1 }} />
                <span>Bad Orders</span>
              </MenuItem>
            </SubMenu>

            <SubMenu
              icon={<DeliveryDining style={{ fontSize: "18px" }} />}
              label="Delivery"
            >
              <MenuItem
                component={<Link to="/delivery/bulk-import" />}
                active={activeSubMenu === "delivery"}
                onClick={() => handleSubMenuClick("delivery")}
                style={{
                  paddingLeft: "1.2rem",
                }}
              >
                <FiberManualRecord sx={{ fontSize: "0.5rem", mr: 1 }} />
                <span>Delivery</span>
              </MenuItem>
              <MenuItem
                component={<Link to="/delivery/bad-delivery" />}
                active={activeSubMenu === "bad-delivery"}
                onClick={() => handleSubMenuClick("bad-delivery")}
                style={{
                  paddingLeft: "1.2rem",
                }}
              >
                <FiberManualRecord sx={{ fontSize: "0.5rem", mr: 1 }} />
                <span>Bad Delivery</span>
              </MenuItem>
            </SubMenu>

            <MenuItem icon={<Class style={{ fontSize: "18px" }} />}>
              WHT Trays
            </MenuItem>
            <SubMenu
              icon={<PlayCircleOutline style={{ fontSize: "18px" }} />}
              label="Recon Sheet"
            ></SubMenu>
            <SubMenu
              icon={<FormatAlignRightRounded style={{ fontSize: "18px" }} />}
              label="UIC Manage"
            ></SubMenu>
            <SubMenu
              icon={<TransferWithinAStation style={{ fontSize: "18px" }} />}
              label="Bag Transfer"
            ></SubMenu>
            <SubMenu
              icon={<Assignment style={{ fontSize: "18px" }} />}
              label="Assign to Agent"
            ></SubMenu>
            <SubMenu
              icon={<SortRounded style={{ fontSize: "18px" }} />}
              label="Sorting"
            ></SubMenu>
            <SubMenu
              icon={<SortRounded style={{ fontSize: "18px" }} />}
              label="WHT to RP"
            ></SubMenu>
            <MenuItem
              icon={<AddShoppingCartRounded style={{ fontSize: "18px" }} />}
            >
              Pickup
            </MenuItem>
            <SubMenu
              icon={<CallMerge style={{ fontSize: "18px" }} />}
              label="Merge"
            ></SubMenu>
            <SubMenu
              icon={<ShoppingCart style={{ fontSize: "18px" }} />}
              label="Tray Transfer"
            ></SubMenu>

            <SubMenu
              icon={<TrackChanges style={{ fontSize: "18px" }} />}
              label="Rack Change"
            ></SubMenu>
            <SubMenu
              icon={<ArtTrack style={{ fontSize: "18px" }} />}
              label="Track"
            ></SubMenu>
            <SubMenu
              icon={<Report style={{ fontSize: "18px" }} />}
              label="Report"
            ></SubMenu>
            <MenuItem
              icon={<ExitToApp style={{ fontSize: "18px" }} />}
              onClick={handleLogoutClick}
              style={{ marginTop: "auto" }}
            >
              Logout
            </MenuItem>
          </Menu>
        </ProSidebar>
      </Box>

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
