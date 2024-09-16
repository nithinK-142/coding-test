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
  deliveryDate: Date;
  importedAt: Date;
}

const Order = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  async function getOrders() {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/order/orders"
      );

      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrders();
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
            to="/order/bulk-import"
            size="small"
            sx={{ my: 2, fontSize: "12px" }}
          >
            Add Bulk Order
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
              <TableCell>Order ID</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Order TimeStamp</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Partner ID</TableCell>
              <TableCell>Item ID</TableCell>
              <TableCell>Old Item Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={order.orderId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ color: "red" }}>Pending</TableCell>
                <TableCell>
                  {generateFormattedDateTime(new Date(order.importedAt))}
                </TableCell>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>
                  {generateFormattedDateTime(new Date(order.orderDate))}
                </TableCell>
                <TableCell>{order.orderTimestamp}</TableCell>
                <TableCell>{order.orderStatus}</TableCell>
                <TableCell>{order.partnerId}</TableCell>
                <TableCell>{order.itemId}</TableCell>
                <TableCell>{order.oldItemDetails}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Order;
