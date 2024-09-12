import { Typography } from "@mui/material";
import Card from "../components/Card";
import { Box, Grid } from "@mui/system";
import { dashboardItems } from "../constants";

const Dashboard = () => {
  return (
    <Box>
      <Typography
        variant="h2"
        component="h2"
        sx={{ fontSize: "14px", marginBottom: "10px", fontWeight: "600" }}
      >
        DASHBOARD
      </Typography>
      <Grid
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          overflow: "hidden",
          paddingBottom: "16px",
        }}
      >
        {dashboardItems.map((item, index) => (
          <Card key={index} dashboardItem={item} />
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
