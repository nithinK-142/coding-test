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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { Check, Close } from "@mui/icons-material";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeCell, setActiveCell] = useState<{
    row: number;
    field: keyof DeliveryData;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [isValidated, setIsValidated] = useState(false);
  const [showValidate, setShowValidate] = useState(true);

  const handleDeliveryDataValidated = (validData: DeliveryData[]) => {
    setDeliveryData(validData);
    setEditedData(validData);
    setIsValidated(false);
    setErrors({});
  };

  const validateField = (field: keyof DeliveryData, value: string) => {
    let errorMessage = "";

    if (
      [
        "Diagnostics Discount",
        "Storage Discount",
        "Doorstep Diagnostics",
      ].includes(field)
    ) {
      return errorMessage;
    }

    if (!value.trim()) {
      errorMessage = `${field} is required.`;
    } else if (field === "Order ID" && !/^[0-9-]+$/.test(value)) {
      errorMessage = "Order ID should be numeric characters and hyphens.";
    }

    return errorMessage;
  };

  const validateAllData = (data: DeliveryData[]) => {
    const newErrors: Record<string, string> = {};
    const orderIds = new Set<string>();

    data.forEach((row, rowIndex) => {
      deliveryRequiredFields.forEach((field) => {
        const error = validateField(field, row[field]);
        if (error) {
          newErrors[`${rowIndex}-${field}`] = error;
        }
      });

      // Check for duplicate Order IDs
      if (orderIds.has(row["Order ID"])) {
        newErrors[`${rowIndex}-Order ID`] = "Duplicate Order ID detected.";
      } else {
        orderIds.add(row["Order ID"]);
      }

      if (orderIds.has(row["Tracking ID"])) {
        newErrors[`${rowIndex}-Tracking ID`] =
          "Duplicate Tracking ID detected.";
      } else {
        orderIds.add(row["Tracking ID"]);
      }
    });

    setErrors(newErrors);
    setIsValidated(true);
    setShowValidate(false);
  };

  const handleCellEdit = (
    rowIndex: number,
    field: keyof DeliveryData,
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
      setDeliveryData(editedData);
      saveDeliveryData(editedData);
    } else {
      setDialogMessage("Please fix all errors before saving.");
      setDialogOpen(true);
    }
  };

  const saveDeliveryData = async (data: DeliveryData[]) => {
    try {
      const { data: response } = await axios.post(
        import.meta.env.VITE_API_URL + "/delivery/save",
        data
      );
      console.log(response);
      setDialogMessage("Data saved successfully.");
    } catch (error) {
      setDialogMessage("Failed to save data.");
    } finally {
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CSVReader
          requiredFields={deliveryRequiredFields}
          onDataValidated={handleDeliveryDataValidated}
        />
        {deliveryData.length > 0 && showValidate && (
          <Button
            variant="contained"
            sx={{ fontSize: "12px", mt: 2 }}
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
                          {![
                            "Diagnostics Discount",
                            "Storage Discount",
                            "Doorstep Diagnostics",
                          ].includes(field) &&
                            isValidated && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: "20%",
                                  right: -10,
                                  transform: "translateY(-50%)",
                                }}
                              >
                                {!errors[`${rowIndex}-${field}`] ? (
                                  <Check
                                    sx={{ color: "green", marginLeft: 1 }}
                                  />
                                ) : (
                                  <Close sx={{ color: "red", marginLeft: 1 }} />
                                )}
                              </Box>
                            )}
                        </Box>

                        {![
                          "Diagnostics Discount",
                          "Storage Discount",
                          "Doorstep Diagnostics",
                        ].includes(field) &&
                          isValidated &&
                          errors[`${rowIndex}-${field}`] && (
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
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Data</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
