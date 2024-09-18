import { useCallback, useState } from "react";
import { useResultDialog } from "../context/ResultDialogContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CSVReader from "../components/CSVReader";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";

const orderRequiredFields = [
  "Order ID",
  "Order Date",
  "Order Timestamp",
  "Order Status",
  "Partner ID",
  "Partner Shop",
  "Item ID",
  "Old Item Details",
  "IMEI",
  "Tracking ID",
  "Delivery Date",
] as const;

type OrderData = Record<(typeof orderRequiredFields)[number], string>;

interface ValidationError {
  index: number;
  message: string;
}

interface ValidationErrors {
  [field: string]: ValidationError[];
}

function OrderImport() {
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValidated, setIsValidated] = useState(false);
  const { successDialog, failureDialog } = useResultDialog();
  const [isDataValidationCalled, setIsDataValidationCalled] = useState(false);
  const navigate = useNavigate();

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/order/save`,
        orderData
      );
      console.log(response.data);
      successDialog("Data saved successfully.");
      navigate("/order");
    } catch (error: any) {
      failureDialog(error.response.data.message);
    }
  };

  const handleOrderDataUploaded = (uploadedData: OrderData[]) => {
    setOrderData(uploadedData);
    setIsValidated(false);
    setErrors({});
  };

  const validateData = async () => {
    try {
      setIsDataValidationCalled(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/order/validate`,
        orderData
      );
      successDialog(response.data.message);
      setIsValidated(true);
      setErrors({});
    } catch (error: any) {
      console.error(error.response.data.errors);
      setIsValidated(false);
      setErrors(error.response.data.errors);
      failureDialog("Data validation failed.");
    }
  };

  const handleCellChange = useCallback(
    (rowIndex: number, field: keyof OrderData, value: string) => {
      setOrderData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex] = { ...newData[rowIndex], [field]: value };
        return newData;
      });
      setIsValidated(false);
    },
    []
  );

  const hasErrors = Object.keys(errors).length > 0;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        p: 1,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
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
        {orderData.length > 0 && (!isValidated || hasErrors) && (
          <Button
            variant="contained"
            sx={{ fontSize: "12px" }}
            onClick={validateData}
          >
            Validate Data
          </Button>
        )}

        {isValidated && !hasErrors && (
          <Button
            variant="contained"
            color="primary"
            sx={{ fontSize: "12px" }}
            onClick={handleSaveChanges}
          >
            Submit
          </Button>
        )}
      </Box>

      {orderData.length > 0 && (
        <Box
          sx={{
            mx: "auto",
            borderRadius: "4px",
            my: 2,
          }}
        >
          <TableContainer
            sx={{
              maxWidth: 1300,
              marginBottom: 1,
              overflow: "auto",
              "&::-webkit-scrollbar": {
                display: "none", // Hide scrollbars for WebKit browsers (Chrome, Safari)
              },
              "-ms-overflow-style": "none", // Hide scrollbars for IE and Edge
              "scrollbar-width": "none", // Hide scrollbars for Firefox
            }}
          >
            <Table
              stickyHeader
              aria-label="order data table"
              sx={{
                minWidth: 2400,
                borderCollapse: "separate",
                borderSpacing: "0",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      minWidth: 80,
                    }}
                  >
                    Sl No
                  </TableCell>
                  {orderRequiredFields.map((field) => (
                    <TableCell
                      key={field}
                      sx={{
                        fontWeight: "bold",
                        minWidth: 150,
                      }}
                    >
                      {field}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orderData.map((row, rowIndex) => (
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
                        <Box>
                          <TextField
                            value={row[field]}
                            onChange={(e) =>
                              handleCellChange(rowIndex, field, e.target.value)
                            }
                            variant="outlined"
                            size="small"
                            fullWidth
                            InputProps={{
                              disableUnderline: true,
                              style: {
                                fontSize: "0.875rem",
                              },
                            }}
                          />
                          {/* Combine error check */}
                          {isDataValidationCalled && (
                            <Box>
                              {(() => {
                                const error = errors[field]?.find(
                                  (error) => error.index === rowIndex
                                );
                                if (error) {
                                  return (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Error
                                        color="error"
                                        sx={{
                                          marginLeft: 1,
                                          fontSize: "1rem",
                                        }}
                                      />
                                      <Typography
                                        key={error.message}
                                        variant="subtitle2"
                                        color="error"
                                        sx={{
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        {error.message}
                                      </Typography>
                                    </Box>
                                  );
                                } else {
                                  return (
                                    <CheckCircle
                                      color="success"
                                      sx={{ marginLeft: 1, fontSize: "1rem" }}
                                    />
                                  );
                                }
                              })()}
                            </Box>
                          )}
                        </Box>
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

export default OrderImport;
