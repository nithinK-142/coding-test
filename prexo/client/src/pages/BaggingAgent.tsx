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
  Paper,
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

const BaggingAgent = () => {
  const [isBagValid, setIsBagValid] = useState(false);
  const [bagId, setBagId] = useState("");
  const [awbnNo, setAwbnNo] = useState("");
  const [bags, setBags] = useState<IOrder[]>([]);
  const { successDialog, failureDialog } = useResultDialog();

  const [bagData, setBagData] = useState<IOrder[]>([]);

  const checkIsBagValid = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/bag/checkBag/${bagId}`
      );
      setIsBagValid(response.data);
      console.log(response.data);

      if (response.data) {
        successDialog("Bag is valid");
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
    // @ts-ignore
    const newData: IOrder[] = bags
      .map((bag) => ({
        trackingId: bag.trackingId,
        orderId: bag.orderId,
        deliveryDate: generateFormattedDateTime(new Date(bag.deliveryDate)),
      }))
      .filter((bag) => bag.trackingId === awbnNo);
    setBagData(newData);
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

      {isBagValid && bagData.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="bag data table">
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>AWBN Number</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Delivery Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bagData.map((row, rowIndex) => (
                <TableRow key={row?.trackingId}>
                  <TableCell>{rowIndex + 1}</TableCell>
                  <TableCell>{row?.trackingId}</TableCell>
                  <TableCell>{row?.orderId}</TableCell>
                  <TableCell>
                    {row?.deliveryDate.split(" ")[0].replace(/,/g, "")}
                  </TableCell>
                  <TableCell sx={{ color: "green" }}>Valid</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default BaggingAgent;
