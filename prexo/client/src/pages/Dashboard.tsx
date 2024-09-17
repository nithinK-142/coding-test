import { Typography } from "@mui/material";
import Card from "../components/Card";
import { Box, Grid } from "@mui/system";
import { dashboardItems } from "../constants";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth-context";
import axios from "axios";

export type CountType = {
  orderCount: number;
  deliveryCount: number;
  botBagscount: number;
};

const Dashboard = () => {
  const { username } = useContext(AuthContext);

  const [count, setCount] = useState<CountType>({
    orderCount: 0,
    deliveryCount: 0,
    botBagscount: 0,
  });

  useEffect(() => {
    async function getCountData() {
      try {
        const [deliveriesResponse, ordersResponse, botBagsResponse] =
          await Promise.all([
            axios.get(import.meta.env.VITE_API_URL + "/delivery/deliveries"),
            axios.get(import.meta.env.VITE_API_URL + "/order/orders"),
            axios.get(import.meta.env.VITE_API_URL + "/bot/getBotBags"),
          ]);

        const deliveryCount = deliveriesResponse.data.length;
        const orderCount = ordersResponse.data.length;
        const botBagscount = botBagsResponse.data.length;

        setCount({ deliveryCount, orderCount, botBagscount });
      } catch (error) {
        console.error("Error fetching count data", error);
      }
    }

    getCountData();
  }, []);

  return (
    <Box>
      <Typography
        variant="h2"
        component="h2"
        sx={{ fontSize: "14px", marginBottom: "10px", fontWeight: "600" }}
      >
        DASHBOARD
      </Typography>
      {username === "mis" && (
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
            <Card key={index} dashboardItem={item} count={count} />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
