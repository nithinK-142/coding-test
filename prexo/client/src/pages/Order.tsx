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
import { Check, Close } from "@mui/icons-material";
import { useResultDialog } from "../context/ResultDialogContext";
import { Link } from "react-router-dom";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeCell, setActiveCell] = useState<{
    row: number;
    field: keyof OrderData;
  } | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [showValidate, setShowValidate] = useState(true);
  const { successDialog, failureDialog } = useResultDialog();

  const handleOrderDataUploaded = (uploadedData: OrderData[]) => {
    setOrderData(uploadedData);
    setEditedData(uploadedData);
    setIsValidated(false);
    setErrors({});
  };

  const validateField = (field: keyof OrderData, value: string) => {
    let errorMessage = "";

    if (!value.trim()) {
      errorMessage = `${field} is required.`;
    } else if (field === "Order ID" && !/^[0-9-]+$/.test(value)) {
      errorMessage = "Order ID should be numeric characters and hyphens.";
    }

    return errorMessage;
  };

  const validateAllData = (data: OrderData[]) => {
    const newErrors: Record<string, string> = {};
    const orderIds = new Set<string>();

    data.forEach((row, rowIndex) => {
      orderRequiredFields.forEach((field) => {
        const error = validateField(field, row[field]);
        if (error) {
          newErrors[`${rowIndex}-${field}`] = error;
        }
      });

      // Check for duplicate Order IDs
      if (orderIds.has(row["Order ID"])) {
        newErrors[`${rowIndex}-Order ID`] = "Duplicate Order ID detected.";
        failureDialog("Duplicate Order ID detected.");
      } else {
        orderIds.add(row["Order ID"]);
      }
    });

    setErrors(newErrors);
    setIsValidated(true);
    setShowValidate(false);
  };

  const handleCellEdit = (
    rowIndex: number,
    field: keyof OrderData,
    value: string
  ) => {
    setEditedData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [field]: value };
      return newData;
    });

    if (isValidated) {
      const error = validateField(field, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${rowIndex}-${field}`]: error,
      }));
    }
  };

  const handleSaveChanges = () => {
    validateAllData(editedData);
    if (Object.keys(errors).length === 0) {
      setOrderData(editedData);
      saveOrderData(editedData);
    } else {
      failureDialog("Please fix all errors before saving.");
    }
  };

  const saveOrderData = async (data: OrderData[]) => {
    try {
      const { data: response } = await axios.post(
        import.meta.env.VITE_API_URL + "/order/save",
        data
      );
      console.log(response);
      successDialog("Data saved successfully.");
    } catch (error) {
      failureDialog("Failed to save data. Please try again.");
    }
  };

  const handleDataValidation = () => {
    validateAllData(editedData);
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
        Bulk Order
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
            component={Link}
            to="/order"
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
            <a
              href="/ORDER SHEET CSV FILE DEMO.csv"
              style={{ textDecoration: "none", color: "white" }}
            >
              Download Sample Sheet
            </a>
          </Button>
        </div>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CSVReader
          requiredFields={orderRequiredFields}
          onDataValidated={handleOrderDataUploaded}
        />
        {orderData.length > 0 && showValidate && (
          <Button
            variant="contained"
            sx={{ fontSize: "12px" }}
            onClick={handleDataValidation}
          >
            Validate Data
          </Button>
        )}
        {isValidated && (
          <Button
            variant="contained"
            color="primary"
            sx={{ fontSize: "12px" }}
            onClick={handleSaveChanges}
            disabled={!isValidated}
          >
            Submit
          </Button>
        )}
      </Box>
      {editedData.length > 0 && (
        <Box sx={{ mx: "auto", borderRadius: "4px", mt: 2 }}>
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
                {editedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>{rowIndex + 1}</TableCell>
                    {orderRequiredFields.map((field) => (
                      <TableCell
                        key={field}
                        sx={{
                          minWidth: 220,
                          paddingBlock: 1,
                          paddingInline: 2,
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <TextField
                            value={row[field]}
                            onChange={(e) =>
                              handleCellEdit(rowIndex, field, e.target.value)
                            }
                            variant="outlined"
                            size="small"
                            fullWidth
                            InputProps={{
                              disableUnderline: true,
                              style: {
                                fontSize: "0.875rem",
                                borderColor:
                                  activeCell?.row === rowIndex &&
                                  activeCell?.field === field
                                    ? "lightblue"
                                    : "inherit",
                              },
                            }}
                            onFocus={() =>
                              setActiveCell({ row: rowIndex, field })
                            }
                            onBlur={() => setActiveCell(null)}
                          />
                          {isValidated && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: "20%",
                                right: -10,
                                transform: "translateY(-50%)",
                              }}
                            >
                              {!errors[`${rowIndex}-${field}`] ? (
                                <Check sx={{ color: "green", marginLeft: 1 }} />
                              ) : (
                                <Close sx={{ color: "red", marginLeft: 1 }} />
                              )}
                            </Box>
                          )}
                        </Box>

                        {isValidated && errors[`${rowIndex}-${field}`] && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ marginTop: "4px" }}
                          >
                            {errors[`${rowIndex}-${field}`]}
                          </Typography>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
