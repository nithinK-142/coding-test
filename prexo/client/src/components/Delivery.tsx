import { useState } from "react";
import CSVReader from "./CSVReader";
import { Box, Typography, Paper } from "@mui/material";

const deliveryRequiredFields = [
  "Tracking ID",
  "Delivery Date",
  "Delivery Status",
  "Recipient Name",
  "Recipient Address",
  "Delivery Partner",
  "Estimated Delivery Time",
] as const;

type DeliveryData = Record<(typeof deliveryRequiredFields)[number], string>;

export default function Delivery() {
  const [deliveryData, setDeliveryData] = useState<DeliveryData[]>([]);

  const handleDeliveryDataValidated = (validData: DeliveryData[]) => {
    setDeliveryData(validData);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Delivery CSV Upload
      </Typography>
      <CSVReader
        requiredFields={deliveryRequiredFields}
        onDataValidated={handleDeliveryDataValidated}
      />
      {deliveryData.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Validated Delivery Data:
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
            <pre>{JSON.stringify(deliveryData, null, 2)}</pre>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
