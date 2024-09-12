import { Box, Grid } from "@mui/system";
import { DashboardItem } from "../constants";
import { Typography } from "@mui/material";

const Card = (dashboardItem: { dashboardItem: DashboardItem }) => {
  console.log(dashboardItem.dashboardItem.icon);
  return (
    <Grid
      style={{
        color: "black",
        fontSize: "30px",
        width: "320px",
        // height: "80px",
        borderRadius: "10px",
        boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",

        display: "flex",
        padding: "1rem",
      }}
    >
      <Box sx={{ marginRight: "1rem", opacity: 0.4, fontSize: "10px" }}>
        {dashboardItem.dashboardItem.icon}
      </Box>

      <Box>
        <Typography
          component={"h3"}
          sx={{ fontWeight: "600", opacity: 0.8, fontSize: "18px" }}
        >
          {dashboardItem.dashboardItem.count}
        </Typography>

        <Typography component={"h4"} sx={{ fontSize: "12px" }}>
          {dashboardItem.dashboardItem.title}
        </Typography>
      </Box>
    </Grid>
  );
};

export default Card;
