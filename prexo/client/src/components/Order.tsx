import { useState } from "react";
import CSVReader from "./CSVReader";
import { Box, Typography, Paper } from "@mui/material";

const orderRequiredFields = [
  "Order ID",
  "Order Date",
  "Order Timestamp",
  "Order Status",
  "Buyback Category",
  "Partner ID",
  "Partner Email",
  "Partner Shop",
  "Item ID",
  "Old Item Details",
  "IMEI",
  "GEP Order",
  "Base Discount",
  "Partner Purchase Price",
  "Tracking ID",
  "Delivery Date",
] as const;

type OrderData = Record<(typeof orderRequiredFields)[number], string>;

export default function Order() {
  const [orderData, setOrderData] = useState<OrderData[]>([]);

  const handleOrderDataValidated = (validData: OrderData[]) => {
    setOrderData(validData);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Order CSV Upload
      </Typography>
      <CSVReader
        requiredFields={orderRequiredFields}
        onDataValidated={handleOrderDataValidated}
      />
      {orderData.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Validated Order Data:
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              maxHeight: 400,
              overflow: "auto",
              "& pre": {
                margin: 0,
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              },
            }}
          >
            <pre>{JSON.stringify(orderData, null, 2)}</pre>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
