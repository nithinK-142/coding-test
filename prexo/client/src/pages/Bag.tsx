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
import { Create, Delete } from "@mui/icons-material";

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

  type BagData = Record<(typeof bagRequiredFields)[number] | "_id", string>;

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editMode, setEditMode] = useState(false);
  const [editingBagId, setEditingBagId] = useState<string | null>(null);

  const handleOpenDialog = (bag?: BagData) => {
    if (bag) {
      setNewBag({
        bagId: bag["Bag ID"],
        cpc: bag.Location,
        bagDisplayName: bag["Bag Display Name"],
        warehouse: bag.Warehouse,
        bagLimit: bag["Bag Limit"],
        bagCategory: bag["Bag Type"],
        bagDisplay: bag["Bag Display"],
      });
      setEditMode(true);
      setEditingBagId(bag?._id);
    } else {
      setNewBag({
        bagId: "",
        cpc: "",
        bagDisplayName: "",
        warehouse: "",
        bagLimit: "",
        bagCategory: "",
        bagDisplay: "",
      });
      setEditMode(false);
      setEditingBagId(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormErrors({});
    setEditMode(false);
    setEditingBagId(null);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "bagLimit") {
      const numValue = value === "" ? "" : Number(value);
      if (
        value === "" ||
        (typeof numValue === "number" &&
          numValue >= 0 &&
          numValue <= 40 &&
          !isNaN(numValue))
      ) {
        setNewBag((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setNewBag((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "cpc") {
      setNewBag((prev) => ({ ...prev, warehouse: "" }));
    }

    setFormErrors((prev) => ({ ...prev, [name]: "" }));
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

  const cpcOptions = [
    "Bangalore_560067",
    "Gurugram_122016",
    "Delhi_110001",
    "Sales_Gurugaon_122016",
    "gurgaon_122016",
  ];

  const warehouseOptions = {
    Bangalore_560067: [
      "Dock WH: Dealsdray / PREXO Bangalore",
      "Processing WH: Dealsdray / PREXO Bangalore",
      "639 - Spare Parts Warehouse",
      "bagging_bangalore@gmail.com",
    ],
    Gurugram_122016: [
      "Dock WH: Dealsdray / PREXO Grugaon",
      "Processing WH: Dealsdray / PREXO Grugaon",
      "634 - Spare Parts Warehouse",
      "Pre - Processing Warehouse - 633",
      "bagging@gmail.com",
    ],
    Delhi_110001: [
      "Dock WH: Dealsdray / PREXO Delhi",
      "Processing WH: Dealsdray / PREXO Delhi",
      "642 - Spare Parts Warehouse",
      "Pre - Processing Warehouse - 643",
    ],
    Sales_Gurugaon_122016: [
      "Sales Dock WH: Dealsdray / PREXO Gurugaon",
      "Sales Processing WH: Dealsdray / PREXO Gurugaon",
      "sales_bagging@gmail.com",
    ],
    gurgaon_122016: [
      "650 - Spare Parts Warehouse",
      "Pre - Processing Warehouse - 651",
    ],
  };

  const bagCategoryOptions = ["BOT"];

  const handleSaveBag = async () => {
    if (!validateForm()) {
      return;
    }
    const bagData = {
      ...newBag,
      status: "No Status",
      creationDate: new Date().toISOString(),
    };

    try {
      setLoading(true);
      let response;
      if (editMode) {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/bag/editBag/${editingBagId}`,
          bagData
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/bag/saveBag`,
          bagData
        );
      }
      if (response.status === 200 || response.status === 201) {
        getBags();
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Error saving/updating bag:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBag = async (bagId: string) => {
    if (window.confirm("Are you sure you want to delete this bag?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/bag/deleteBag/${bagId}`
      );
      if (response.status === 200) {
        getBags();
      }
    } catch (error) {
      console.error("Error deleting bag:", error);
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
        // console.log(response.data);
        setBags(response.data.map((item: any) => formatResponse(item)));
      }
    } catch (error) {
      console.error("Error fetching bags:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (data: any) => {
    const dateObj = new Date(data.creationDate);
    const localDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return {
      _id: data._id,
      "Bag ID": data.bagId,
      Location: data.cpc,
      Warehouse: data.warehouse,
      "Bag Display Name": data.bagDisplayName,
      "Bag Limit": data.bagLimit,
      "Bag Display": data.bagDisplay,
      "Bag Type": data.bagCategory,
      Status: data.status,
      "Creation Date": localDate,
      Actions: "",
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
          onClick={() => handleOpenDialog()}
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
        <TableContainer component={Paper}>
          <Table
            stickyHeader
            aria-label="delivery data table"
            sx={{ minWidth: 1400 }}
            size="small"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    // minWidth: 220,
                    fontWeight: "bold",
                    textAlign: "center",
                    backgroundColor: "gray",
                  }}
                >
                  Sl No
                </TableCell>
                {bagRequiredFields.map((field) => (
                  <TableCell
                    key={field}
                    sx={{
                      // minWidth: 220,
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "gray",
                    }}
                  >
                    {field}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bags.map((row, index) => (
                <TableRow key={row._id}>
                  <TableCell
                    sx={
                      {
                        // minWidth: 220,
                      }
                    }
                  >
                    {index + 1}
                  </TableCell>
                  {bagRequiredFields.map((field) => (
                    <TableCell
                      key={field}
                      sx={
                        {
                          // minWidth: 120,
                        }
                      }
                    >
                      {field === "Actions" ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Create
                            sx={{
                              color: "blue",
                              cursor: "pointer",
                              opacity: "0.7",
                            }}
                            onClick={() => handleOpenDialog(row)}
                          />
                          <Delete
                            sx={{
                              color: "red",
                              cursor: "pointer",
                              opacity: "0.7",
                            }}
                            onClick={() => handleDeleteBag(row._id)}
                          />
                        </Box>
                      ) : (
                        <Typography
                          style={{
                            fontSize: "0.875rem",
                            padding: 0,
                            textAlign: "center",
                          }}
                        >
                          {row[field]}
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
        <DialogTitle sx={{ fontSize: "1rem" }}>
          {editMode ? "Edit Bag" : "Add New Bag"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} pt={1}>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  name="bagId"
                  label="Bag ID"
                  fullWidth
                  size="small"
                  disabled
                  value={newBag.bagId || ""}
                />
                <TextField
                  name="bagDisplayName"
                  label="Bag Display Name"
                  value={newBag.bagDisplayName}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={!!formErrors.bagDisplayName}
                  helperText={formErrors.bagDisplayName}
                />
                <TextField
                  name="bagLimit"
                  label="Bag Limit"
                  type="number"
                  value={newBag.bagLimit}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 2 }}
                  fullWidth
                  size="small"
                  error={!!formErrors.bagLimit}
                  helperText={formErrors.bagLimit}
                />
                <TextField
                  name="bagDisplay"
                  label="Bag Display"
                  value={newBag.bagDisplay}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  error={!!formErrors.bagDisplay}
                  helperText={formErrors.bagDisplay}
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
                  error={!!formErrors.cpc}
                  helperText={formErrors.cpc}
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
                  error={!!formErrors.warehouse}
                  helperText={formErrors.warehouse}
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
                  error={!!formErrors.bagCategory}
                  helperText={formErrors.bagCategory}
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
          <Button
            onClick={handleSaveBag}
            variant="contained"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Bag"}
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
