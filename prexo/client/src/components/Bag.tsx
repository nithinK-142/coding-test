import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Grid,
} from "@mui/material";
import { Create, Delete, Replay } from "@mui/icons-material";

const Bag = () => {
  const bagRequiredFields = [
    "Bag ID",
    "Location",
    "Warehouse",
    "Bag Display Name",
    "Bag Limit",
    "Bag Display",
    "Bag Type",
    "Status",
    "Creation Date",
    "Actions",
  ] as const;

  type BagData = Record<(typeof bagRequiredFields)[number], string>;

  const [bags, setBags] = useState<BagData[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBag, setNewBag] = useState({
    bagId: "",
    cpc: "",
    bagDisplayName: "",
    warehouse: "",
    bagLimit: "",
    bagCategory: "",
    bagDisplay: "",
  });
  const [nextBagId, setNextBagId] = useState(2000);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenDialog = () => {
    const bagDisplayName = `PREXO / GGN / BOT Bag #${nextBagId}`;
    setNewBag((prev) => ({
      ...prev,
      bagId: `DDB-BLR-${nextBagId}`,
      bagDisplayName,
      bagDisplay: bagDisplayName,
    }));
    setDialogOpen(true);
  };
  const handleCloseDialog = () => setDialogOpen(false);

  useEffect(() => {
    setNextBagId(getBagId());
  }, []);

  const getBagId = () => {
    return parseInt(localStorage.getItem("nextBagId") || "2000");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "bagLimit") {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue > 40) return;
    }
    setNewBag((prev) => ({ ...prev, [name]: value }));

    if (name === "cpc") {
      setNewBag((prev) => ({ ...prev, warehouse: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    Object.entries(newBag).forEach(([key, value]) => {
      if (!value) {
        errors[key] = "This field is required";
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const cpcOptions = ["Bangalore_560067", "Gurugram_122016"];
  const warehouseOptions = {
    Bangalore_560067: ["Bangalore Warehouse A", "Bangalore Warehouse B"],
    Gurugram_122016: ["Gurugram Warehouse X", "Gurugram Warehouse Y"],
  };
  const bagCategoryOptions = ["BOT"];

  const handleSaveBag = async () => {
    if (!validateForm()) {
      return;
    }
    const newBagData = {
      ...newBag,
      status: "No Status",
      creationDate: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bag/saveBag`,
        newBagData
      );
      localStorage.setItem("nextBagId", String(nextBagId + 1));
      if (response.status === 201) {
        getBags();
        handleCloseDialog();
        setNewBag({
          bagId: "",
          cpc: "",
          bagDisplayName: "",
          warehouse: "",
          bagLimit: "",
          bagCategory: "",
          bagDisplay: "",
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error saving bag:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBags = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/bag/getBags`
      );
      if (response.status === 200) {
        console.log(response.data);
        setBags(response.data.map((item: any) => formatResponse(item)));
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching bags:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (data: any) => {
    // Convert the ISO string to a Date object
    const dateObj = new Date(data.creationDate);

    // Format the date to a readable local format
    const localDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return {
      "Bag ID": data.bagId,
      Location: data.cpc, // Assuming cpc represents location
      Warehouse: data.warehouse,
      "Bag Display Name": data.bagDisplayName,
      "Bag Limit": data.bagLimit,
      "Bag Display": data.bagDisplay,
      "Bag Type": data.bagCategory, // Assuming bagCategory represents bag type
      Status: data.status,
      "Creation Date": localDate,
      Actions: "", // Assuming no data provided for "Actions"
    };
  };

  useEffect(() => {
    getBags();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button
          variant="contained"
          sx={{ fontSize: "0.8rem", height: "auto" }}
          onClick={handleOpenDialog}
        >
          Add New Bag
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#E49B0F",
            fontSize: "0.8rem",
            height: "auto",
            color: "black",
          }}
        >
          Add Bulk Bag
        </Button>
      </div>

      <Typography sx={{ mt: 2 }}>All Bags</Typography>

      <Box sx={{ mx: "auto", borderRadius: "4px" }}>
        {/* {loading && <Typography>Loading...</Typography>} */}
        {/* {bags.length > 0 && ( */}

        <TableContainer
          component={Paper}
          sx={{ maxHeight: 600, maxWidth: 1300, overflow: "auto" }}
        >
          <Table stickyHeader aria-label="delivery data table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", minWidth: 50 }}>
                  Sl No
                </TableCell>
                {bagRequiredFields.map((field) => (
                  <TableCell
                    key={field}
                    sx={{ fontWeight: "bold", minWidth: 100 }}
                  >
                    {field}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bags.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ padding: "8px 16px", minWidth: 100 }}
                >
                  <TableCell>{index + 1}</TableCell>
                  {bagRequiredFields.map((field) => (
                    <TableCell key={field} sx={{ padding: "8px 16px" }}>
                      {field === "Actions" ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Create
                            sx={{
                              color: "blue",
                              cursor: "pointer",
                              opacity: "0.7",
                            }}
                          />
                          <Delete
                            sx={{
                              color: "red",
                              cursor: "pointer",
                              opacity: "0.7",
                            }}
                          />
                          <Replay sx={{ cursor: "pointer", opacity: "0.7" }} />
                        </Box>
                      ) : (
                        <TextField
                          value={row[field]}
                          variant="standard"
                          fullWidth
                          InputProps={{
                            disableUnderline: true,
                            style: { fontSize: "0.875rem" },
                            readOnly: field === "Bag ID",
                          }}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* )} */}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        PaperProps={{
          style: {
            width: "600px",
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1rem" }}>Bag</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} pt={1}>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  name="bagId"
                  label="Bag ID"
                  value={newBag.bagId}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  name="bagDisplayName"
                  label="Bag Display Name"
                  value={newBag.bagDisplayName}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  name="bagLimit"
                  label="Bag Limit"
                  type="number"
                  value={newBag.bagLimit}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  name="bagDisplay"
                  label="Bag Display"
                  value={newBag.bagDisplay}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  name="cpc"
                  label="CPC"
                  select
                  value={newBag.cpc}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                >
                  {cpcOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="warehouse"
                  label="Warehouse"
                  select
                  value={newBag.warehouse}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  disabled={!newBag.cpc}
                >
                  {newBag.cpc &&
                    warehouseOptions[
                      newBag.cpc as keyof typeof warehouseOptions
                    ].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                </TextField>
                <TextField
                  name="bagCategory"
                  label="Bag Category"
                  select
                  value={newBag.bagCategory}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                >
                  {bagCategoryOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 4,
            py: 2,
          }}
        >
          <Button onClick={handleSaveBag} variant="contained" color="primary">
            Save
          </Button>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="warning"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Bag;
