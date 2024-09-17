import { Box } from "@mui/system";
import { DashboardItem } from "../constants";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { CountType } from "../pages/Dashboard";

interface CardProps {
  dashboardItem: DashboardItem;
  count: CountType;
}

const Card = ({ dashboardItem, count }: CardProps) => {
  return (
    <Box
      component={Link}
      to={dashboardItem.path}
      style={{
        color: "black",
        fontSize: "30px",
        width: "320px",
        borderRadius: "10px",
        boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
        display: "flex",
        padding: "1rem",
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      <Box sx={{ marginRight: "1rem", opacity: 0.4, fontSize: "10px" }}>
        {dashboardItem.icon}
      </Box>

      <Box>
        <Typography
          component={"h3"}
          sx={{ fontWeight: "600", opacity: 0.8, fontSize: "18px" }}
        >
          {dashboardItem.title === "Orders"
            ? count.orderCount || 0
            : dashboardItem.title === "Delivery"
            ? count.deliveryCount || 0
            : dashboardItem.title === "Assign to BOT"
            ? count.botBagscount || 0
            : dashboardItem.title}
        </Typography>

        <Typography component={"h4"} sx={{ fontSize: "12px" }}>
          {dashboardItem.title}
        </Typography>
      </Box>
    </Box>
  );
};

export default Card;
