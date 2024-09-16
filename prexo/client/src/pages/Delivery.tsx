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
import { Link, useNavigate } from "react-router-dom";

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
  const [isValidated, setIsValidated] = useState(false);
  const [showValidate, setShowValidate] = useState(true);
  const { successDialog, failureDialog } = useResultDialog();
  const navigate = useNavigate();

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
    } else if (field === "Tracking ID" && !/^\d{8}$|^\d{12}$/.test(value)) {
      errorMessage = "Tracking ID must be either 8 or 12 digits.";
    }

    return errorMessage;
  };

  const validateAllData = async (data: DeliveryData[]) => {
    const newErrors: Record<string, string> = {};
    const orderIds = new Set<string>();
    const trackingIds = new Set<string>();

    // Extract all Order IDs first
    const allOrderIds = data.map((row) => row["Order ID"]);

    // Check if Order IDs exist in the backend
    let existingOrderIds: Set<string>;
    try {
      const orderIdsExist = await orderIdsExists(allOrderIds);
      if (!orderIdsExist) {
        failureDialog("Order sheet not imported.");
        newErrors["generalError"] =
          "One or more Order IDs do not exist in the system.";
        setErrors(newErrors);
        setIsValidated(true);
        setShowValidate(false);
        return; // Exit early if Order IDs don't exist
      }
      existingOrderIds = new Set(allOrderIds);
    } catch (error) {
      console.error("Error checking Order IDs:", error);
      failureDialog("Failed to verify Order IDs. Please try again.");
      newErrors["generalError"] = "Failed to verify Order IDs.";
      setErrors(newErrors);
      setIsValidated(true);
      setShowValidate(false);
      return; // Exit early if there's an error
    }

    // Proceed with other validations
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
        failureDialog("Duplicate Order ID detected. Please check your data.");
      } else {
        orderIds.add(row["Order ID"]);
      }

      // Check if Order ID exists (this is now redundant but kept for completeness)
      if (!existingOrderIds.has(row["Order ID"])) {
        newErrors[`${rowIndex}-Order ID`] =
          "Duplicate Order ID detected. Please check your data.";
      }

      if (trackingIds.has(row["Tracking ID"])) {
        newErrors[`${rowIndex}-Tracking ID`] =
          "Duplicate Tracking ID detected.";
        failureDialog("Duplicate Tracking ID detected.");
      } else {
        trackingIds.add(row["Tracking ID"]);
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
      successDialog("Data validated.");
    } else {
      failureDialog("Please fix all errors before saving.");
    }
  };

  const saveDeliveryData = async (data: DeliveryData[]) => {
    console.log(data);
    try {
      const { data: response } = await axios.post(
        import.meta.env.VITE_API_URL + "/delivery/save",
        data
      );
      console.log(response);
      successDialog("Data saved successfully.");
      navigate("/delivery");
    } catch (error) {
      failureDialog("Failed to save data. Please try again.");
    }
  };

  const handleDataValidation = () => {
    validateAllData(editedData);
  };

  const orderIdsExists = async (data: string[]): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/order/orders-exists`,
        data
      );
      console.log("Order existence check response:", response.data);
      console.log(response.data.allOrdersExist);
      return response.data.allOrdersExist;
    } catch (error: any) {
      console.error("Error checking order existence:", error);
      return error;
    }
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
            component={Link}
            to="/delivery"
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
              href="/DELIVERY SHEET CSV FILE DEMO.csv"
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
          requiredFields={deliveryRequiredFields}
          onDataValidated={handleDeliveryDataValidated}
        />
        {deliveryData.length > 0 && showValidate && (
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
            sx={{
              maxHeight: 600,
              maxWidth: 1300,
            }}
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
    </Box>
  );
}
