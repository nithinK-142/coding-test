import { useState } from "react";
import CSVReader from "../components/CSVReader";
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

const deliveryRequiredFields = [
  "Tracking ID",
  "Order ID",
  "Order Date",
  "Item ID",
  "GEP Order",
  "IMEI",
  "Partner Purchase Price",
  "Partner Shop",
  "Base Discount",
  "Diagnostics Discount",
  "Storage Discount",
  "Buyback Category",
  "Doorstep Diagnostics",
] as const;

type DeliveryData = Record<(typeof deliveryRequiredFields)[number], string>;

export default function Delivery() {
  const [deliveryData, setDeliveryData] = useState<DeliveryData[]>([]);
  const [editedData, setEditedData] = useState<DeliveryData[]>([]);
  const [activeCell, setActiveCell] = useState<{
    row: number;
    field: keyof DeliveryData;
  } | null>(null);

  const handleDeliveryDataValidated = (validData: DeliveryData[]) => {
    setDeliveryData(validData);
    setEditedData(validData);
  };

  const handleCellEdit = (
    rowIndex: number,
    field: keyof DeliveryData,
    value: string
  ) => {
    const newData = [...editedData];
    newData[rowIndex] = { ...newData[rowIndex], [field]: value };
    setEditedData(newData);
  };

  const handleSaveChanges = () => {
    setDeliveryData((prev) => [...prev, ...editedData]);
    saveDeliveryData(deliveryData);
  };

  const saveDeliveryData = async (data: DeliveryData[]) => {
    const { data: response } = await axios.post(
      import.meta.env.VITE_API_URL + "/delivery/save",
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
        p: 1,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        style={{ fontSize: "0.9rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Bulk Delivery
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          style={{ fontSize: "0.9rem", fontWeight: "bold" }}
        >
          Upload File
        </Typography>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#E49B0F",
              fontSize: "0.8rem",
              height: "auto",
              color: "Black",
            }}
          >
            Back to list
          </Button>
          <Button
            variant="contained"
            sx={{ fontSize: "0.8rem", height: "auto" }}
          >
            Download Sample Sheet
          </Button>
        </div>
      </Box>

      <Box sx={{ mx: "auto" }}>
        <CSVReader
          requiredFields={deliveryRequiredFields}
          onDataValidated={handleDeliveryDataValidated}
        />
      </Box>
      {editedData.length > 0 && (
        <Box sx={{ mx: "auto", borderRadius: "4px" }}>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 600, maxWidth: 1250, overflow: "auto" }}
          >
            <Table
              stickyHeader
              aria-label="delivery data table"
              sx={{ minWidth: 2400 }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", minWidth: 80 }}>
                    Sl No
                  </TableCell>
                  {deliveryRequiredFields.map((field) => (
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
                {editedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>{rowIndex + 1}</TableCell>
                    {deliveryRequiredFields.map((field) => (
                      <TableCell
                        key={field}
                        // sx={{
                        //   padding: "8px 16px",
                        // }}
                      >
                        <TextField
                          value={row[field]}
                          onChange={(e) =>
                            handleCellEdit(rowIndex, field, e.target.value)
                          }
                          variant="outlined"
                          fullWidth
                          InputProps={{
                            disableUnderline: true,
                            style: {
                              fontSize: "0.875rem",
                              paddingTop: 0,
                              borderColor:
                                activeCell?.row === rowIndex &&
                                activeCell.field === field
                                  ? "lightblue"
                                  : "inherit",
                            },
                          }}
                          onFocus={() =>
                            setActiveCell({ row: rowIndex, field })
                          }
                          onBlur={() => setActiveCell(null)}
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
