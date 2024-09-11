import { useState } from "react";
import CSVReader from "./CSVReader";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

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
  const [editedData, setEditedData] = useState<OrderData[]>([]);

  const handleOrderDataValidated = (validData: OrderData[]) => {
    setOrderData(validData);
    setEditedData(validData);
  };

  const handleCellEdit = (
    rowIndex: number,
    field: keyof OrderData,
    value: string
  ) => {
    const newData = [...editedData];
    newData[rowIndex] = { ...newData[rowIndex], [field]: value };
    setEditedData(newData);
  };

  const handleSaveChanges = () => {
    setOrderData((prev) => [...prev, ...editedData]);
    saveOrderData(orderData);
  };

  const saveOrderData = async (data: OrderData[]) => {
    const { data: response } = await axios.post(
      import.meta.env.VITE_API_URL + "/order/save",
      data
    );
    console.log(response);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        p: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Order CSV Upload
      </Typography>
      <CSVReader
        requiredFields={orderRequiredFields}
        onDataValidated={handleOrderDataValidated}
      />
      {editedData.length > 0 && (
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Validated Order Data:
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 600, overflow: "auto" }}
          >
            <Table
              stickyHeader
              aria-label="order data table"
              sx={{ minWidth: 2000 }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", minWidth: 80 }}>
                    Sl No
                  </TableCell>
                  {orderRequiredFields.map((field) => (
                    <TableCell
                      key={field}
                      sx={{ fontWeight: "bold", minWidth: 150 }}
                    >
                      {field}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {editedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    {orderRequiredFields.map((field) => (
                      <TableCell key={field} sx={{ padding: "8px 16px" }}>
                        <TextField
                          value={row[field]}
                          onChange={(e) =>
                            handleCellEdit(index, field, e.target.value)
                          }
                          variant="standard"
                          fullWidth
                          InputProps={{
                            disableUnderline: true,
                            style: { fontSize: "0.875rem" },
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
