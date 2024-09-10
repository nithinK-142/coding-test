import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div>
      <ProSidebar>
        <Menu>
          <SubMenu label="Orders">
            <MenuItem component={<Link to="/order" />}>+ Order </MenuItem>
          </SubMenu>

          <SubMenu label="Delivery">
            <MenuItem component={<Link to="/delivery" />}>+ Delivery </MenuItem>
          </SubMenu>
        </Menu>
      </ProSidebar>
    </div>
  );
}
