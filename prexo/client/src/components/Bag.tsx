import React, { useState } from "react";
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

  const [editedData, setEditedData] = useState<BagData[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBag, setNewBag] = useState({
    bagId: "",
    cpc: "",
    bagDisplayName: "",
    warehouse: "",
    bagLimit: "",
    bagCategory: "",
    bagDisplay: "",
  });

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewBag((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveBag = () => {
    // Here you would typically send the data to your backend
    // For now, we'll just add it to the editedData array
    const newBagData: BagData = {
      "Bag ID": newBag.bagId,
      Location: newBag.cpc, // Assuming CPC is used as Location
      Warehouse: newBag.warehouse,
      "Bag Display Name": newBag.bagDisplayName,
      "Bag Limit": newBag.bagLimit,
      "Bag Display": newBag.bagDisplay,
      "Bag Type": newBag.bagCategory, // Assuming Bag Category is used as Bag Type
      Status: "Active", // Default status
      "Creation Date": new Date().toISOString().split("T")[0], // Current date
      Actions: "", // Leave empty for now
    };

    setEditedData((prev) => [...prev, newBagData]);
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
  };

  // Sample data for dropdowns
  const cpcOptions = ["CPC1", "CPC2", "CPC3"];
  const warehouseOptions = ["Warehouse A", "Warehouse B", "Warehouse C"];
  const bagCategoryOptions = ["Category 1", "Category 2", "Category 3"];

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
              {editedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  {bagRequiredFields.map((field) => (
                    <TableCell key={field} sx={{ padding: "8px 16px" }}>
                      <TextField
                        value={row[field]}
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
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        PaperProps={{
          style: {
            width: "600px", // Reduced width
            maxHeight: "80vh", // Maximum height
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
                >
                  {warehouseOptions.map((option) => (
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

// import {
//   Box,
//   Button,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { useState } from "react";

// const Bag = () => {
//   const bagRequiredFields = [
//     "Bag ID",
//     "Location",
//     "Warehouse",
//     "Bag Display Name",
//     "Bag Limit",
//     "Bag Display",
//     "Bag Type",
//     "Status",
//     "Careation Date",
//     "Actions",
//   ] as const;

//   type BagData = Record<(typeof bagRequiredFields)[number], string>;

//   const [editedData, setEditedData] = useState<BagData[]>([]);

//   return (
//     <div>
//       <div style={{ display: "flex", gap: "0.5rem" }}>
//         <Button variant="contained" sx={{ fontSize: "0.8rem", height: "auto" }}>
//           Add New Bag
//         </Button>
//         <Button
//           variant="contained"
//           sx={{
//             backgroundColor: "#E49B0F",
//             fontSize: "0.8rem",
//             height: "auto",
//             color: "black",
//           }}
//         >
//           Add Bulk Bag
//         </Button>
//       </div>

//       <Typography sx={{ mt: 2 }}>All Bags</Typography>

//       <Box sx={{ mx: "auto", borderRadius: "4px" }}>
//         <TableContainer
//           component={Paper}
//           sx={{ maxHeight: 600, maxWidth: 1250, overflow: "auto" }}
//         >
//           <Table
//             stickyHeader
//             aria-label="delivery data table"
//             sx={{ minWidth: 2400 }}
//           >
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: "bold", minWidth: 80 }}>
//                   Sl No
//                 </TableCell>
//                 {bagRequiredFields.map((field) => (
//                   <TableCell
//                     key={field}
//                     sx={{ fontWeight: "bold", minWidth: 150 }}
//                   >
//                     {field}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {editedData.map((row, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{index + 1}</TableCell>
//                   {bagRequiredFields.map((field) => (
//                     <TableCell key={field} sx={{ padding: "8px 16px" }}>
//                       <TextField
//                         value={row[field]}
//                         // onChange={(e) =>
//                         //   handleCellEdit(index, field, e.target.value)
//                         // }
//                         variant="standard"
//                         fullWidth
//                         InputProps={{
//                           disableUnderline: true,
//                           style: { fontSize: "0.875rem" },
//                         }}
//                       />
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         {/* <Box mt={2}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSaveChanges}
//           >
//             Save Changes
//           </Button>
//         </Box> */}
//       </Box>
//     </div>
//   );
// };

// export default Bag;
