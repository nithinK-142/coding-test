import type { Request, Response } from "express";
import orderModel, { IOrder } from "../model/order.model";

export const saveOrder = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const filteredOrderData = transformOrderData(data);

    await orderModel.insertMany(filteredOrderData);
    return res.send("order saved");
  } catch (error) {
    console.log(error);
  }
};

export const ordersExists = async (req: Request, res: Response) => {
  try {
    const orderIds: string[] = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid input: Expected an array of order IDs" });
    }

    const existingOrders = await orderModel.find(
      { orderId: { $in: orderIds } },
      "orderId"
    );

    const existingOrderIds = new Set(
      existingOrders.map((order) => order.orderId)
    );

    const allOrdersExist = orderIds.every((id) => existingOrderIds.has(id));

    console.log("All orders exist:", allOrdersExist);

    return res.json({
      allOrdersExist,
      existingOrderIds: Array.from(existingOrderIds),
    });
  } catch (error) {
    console.error("Error in ordersExists:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const transformOrderData = (rawData: any[]): IOrder[] => {
  return rawData.map((order) => ({
    orderId: order["Order ID"],
    orderDate: new Date(order["Order Date"]),
    orderTimestamp: order["Order Timestamp"],
    orderStatus: order["Order Status"],
    buybackCategory: order["Buyback Category"],
    partnerId: order["Partner ID"],
    partnerEmail: order["Partner Email"],
    partnerShop: order["Partner Shop"],
    itemId: order["Item ID"],
    oldItemDetails: order["Old Item Details"],
    imei: order["IMEI"],
    gepOrder: order["GEP Order"] === "TRUE", // Convert to boolean
    baseDiscount: Number(order["Base Discount"]),
    partnerPurchasePrice: Number(order["Partner Purchase Price"]),
    trackingId: order["Tracking ID"],
    deliveryDate: new Date(order["Delivery Date"]),
  }));
};
