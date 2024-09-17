import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useResultDialog } from "../context/ResultDialogContext";
import { generateFormattedDateTime } from "../utils";

export interface IOrder {
  orderId: string;
  orderDate: string;
  orderTimestamp: string;
  orderStatus: string;
  buybackCategory: string;
  partnerId: string;
  partnerEmail: string;
  partnerShop: string;
  itemId: string;
  oldItemDetails: string;
  imei: string;
  gepOrder: boolean;
  baseDiscount: number;
  partnerPurchasePrice: number;
  trackingId: string;
  deliveryDate: string;
  importedAt: string;
}

// Extend IOrder to include the isDuplicate property
interface IOrderWithDuplicateFlag extends IOrder {
  isDuplicate?: boolean;
}

const BaggingAgent = () => {
  const { successDialog, failureDialog } = useResultDialog();
  const [isBagValid, setIsBagValid] = useState(false);
  const [bagId, setBagId] = useState("");
  const [awbnNo, setAwbnNo] = useState("");
  const [bags, setBags] = useState<IOrder[]>([]);
  const [bagData, setBagData] = useState<IOrderWithDuplicateFlag[]>([]);
  const [valid, setValid] = useState(0);
  const [duplicated, setDuplicated] = useState(0);

  const checkIsBagValid = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/bag/checkBag/${bagId}`
      );
      setIsBagValid(response.data);

      if (response.data) {
        successDialog("Bag is valid");
        setValid((prev) => prev + 1);
        fetchBagData();
      } else {
        failureDialog("Bag is Invalid");
      }
    } catch (error) {
      failureDialog("Error checking bag");
      console.log(error);
    }
  };

  const fetchBagData = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/order/orders`
      );
      setBags(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      failureDialog("Error fetching bag data");
    }
  };

  const checkIsAWBNValid = async () => {
    const newData: IOrderWithDuplicateFlag[] = bags
      .filter((bag) => bag.trackingId === awbnNo)
      .map((bag) => ({
        ...bag,
        deliveryDate: generateFormattedDateTime(new Date(bag.deliveryDate)),
      }));

    setBagData((prevData) => {
      const updatedData = [...prevData, ...newData];
      const uniqueTrackingIds = new Set();
      let duplicateCount = 0;

      const processedData = updatedData.map((bag) => {
        if (uniqueTrackingIds.has(bag.trackingId)) {
          duplicateCount++;
          return { ...bag, isDuplicate: true };
        } else {
          uniqueTrackingIds.add(bag.trackingId);
          return { ...bag, isDuplicate: false };
        }
      });

      setDuplicated(duplicateCount);
      setValid(uniqueTrackingIds.size);

      return processedData;
    });

    setAwbnNo("");
  };

  const removeDuplicate = (trackingId: string) => {
    setBagData((prevData) => {
      const indexToRemove = prevData.findIndex(
        (bag) => bag.trackingId === trackingId && bag.isDuplicate
      );
      if (indexToRemove === -1) return prevData;

      const updatedData = [...prevData];
      updatedData.splice(indexToRemove, 1);
      setDuplicated((prev) => prev - 1);
      successDialog("Successfully removed.");
      return updatedData;
    });
  };

  const bagClose = () => {
    if (window.confirm("Are you sure you want to close this bag?")) {
      successDialog("Bag going to Pre-Closure");
    }
  };

  return (
    <Box sx={{ boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", p: 1 }}>
      <Typography
        component={"h3"}
        sx={{ fontSize: "16px", mt: 1, mb: 1.5, width: 200 }}
      >
        Bag ID
      </Typography>
      <Box sx={{ display: "flex" }}>
        <Box
          component={"form"}
          onSubmit={(e) => {
            e.preventDefault();
            checkIsBagValid();
          }}
          sx={{ display: "flex", mb: 2 }}
        >
          <TextField
            variant="outlined"
            size="small"
            label="Bag ID"
            name="bagId"
            value={bagId}
            onChange={(e) => setBagId(e.target.value)}
          />
          {bagId && (
            <Button type="submit" variant="contained" sx={{ mx: 1 }}>
              GO
            </Button>
          )}
        </Box>

        <Box
          component={"form"}
          onSubmit={(e) => {
            e.preventDefault();
            checkIsAWBNValid();
          }}
        >
          {isBagValid && (
            <TextField
              variant="outlined"
              size="small"
              label="Scan AWBN"
              name="awpnNo"
              value={awbnNo}
              onChange={(e) => setAwbnNo(e.target.value)}
            />
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <div></div>
        <div style={{ display: "flex", gap: 25, paddingRight: 10 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "14px", marginBottom: "8px" }}>Total</span>
            <span style={{ fontSize: "22px", fontWeight: 600, opacity: 0.8 }}>
              {bagData.length}/40
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "14px", marginBottom: "8px" }}>valid</span>

            <span style={{ fontSize: "22px", fontWeight: 600, opacity: 0.8 }}>
              {valid}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "14px", marginBottom: "8px" }}>
              Duplicate
            </span>

            <span style={{ fontSize: "22px", fontWeight: 600, opacity: 0.8 }}>
              {duplicated}
            </span>
          </div>
        </div>
      </Box>

      {isBagValid && bagData.length > 0 && (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="bag data table">
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>AWBN Number</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Delivery Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bagData.map((row, rowIndex) => (
                <TableRow key={`${row?.trackingId}-${rowIndex}`}>
                  <TableCell>{rowIndex + 1}</TableCell>
                  <TableCell>{row?.trackingId}</TableCell>
                  <TableCell>{row?.orderId}</TableCell>
                  <TableCell>
                    {row?.deliveryDate.split(" ")[0].replace(/,/g, "")}
                  </TableCell>
                  <TableCell sx={{ color: row.isDuplicate ? "red" : "green" }}>
                    {row.isDuplicate ? "Duplicate" : "Valid"}
                  </TableCell>
                  <TableCell>
                    {row.isDuplicate && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ fontSize: "10px" }}
                        onClick={() => removeDuplicate(row.trackingId)}
                      >
                        Remove
                      </Button>
                    )}
                  </TableCell>
                  <TableCell> </TableCell>
                  <TableCell> </TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {bagData.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box></Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControlLabel
              control={<Checkbox />}
              label="UIC Label"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Sleeves"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
            />
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={{ fontSize: "10px" }}
              onClick={bagClose}
            >
              Close
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BaggingAgent;
