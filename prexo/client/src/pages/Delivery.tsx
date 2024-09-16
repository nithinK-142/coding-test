import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { generateFormattedDateTime } from "../utils";
import { IOrder } from "./Order";

export interface IDelivery {
  trackingId: string;
  orderId: string;
  orderDate: Date;
  itemId: string;
  gepOrder: string;
  imei: string;
  partnerPurchasePrice: number;
  partnerShop: string;
  baseDiscount?: number;
  diagnosticsDiscount?: number;
  storageDiscount?: number;
  buybackCategory: string;
  doorstepDiagnostics?: string;
}

const Order = () => {
  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [loading, setLoading] = useState(true);

  async function getDeliveries() {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/delivery/deliveries"
      );

      const ordersInfo = await axios.get(
        import.meta.env.VITE_API_URL + "/order/orders"
      );

      const filteredDeliveries = ordersInfo.data.filter((order: IOrder) =>
        response.data.some(
          (delivery: IDelivery) => delivery.orderId === order.orderId
        )
      );

      setDeliveries(filteredDeliveries);
      console.log(filteredDeliveries);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDeliveries();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
        <Box></Box>
        <Box>
          <Button
            variant="contained"
            component={Link}
            to="/delivery/bulk-import"
            size="small"
            sx={{ my: 2, fontSize: "12px" }}
          >
            Add Bulk Delivery
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="order table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
              <TableCell>Record No</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Order Imported TimeStamp</TableCell>
              <TableCell>UIC Status</TableCell>
              <TableCell>Tracking ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Order Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveries.map((delivery, index) => (
              <TableRow key={delivery.orderId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ color: "green" }}>Match</TableCell>
                {/* <TableCell>
                  {generateFormattedDateTime(new Date(delivery.importedAt))}
                </TableCell> */}
                <TableCell>{delivery.orderId}</TableCell>
                <TableCell>
                  {generateFormattedDateTime(new Date(delivery.orderDate))}
                </TableCell>
                <TableCell>{delivery.trackingId}</TableCell>
                <TableCell>{delivery.orderId}</TableCell>
                <TableCell>
                  {generateFormattedDateTime(new Date(delivery.orderDate))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Order;
