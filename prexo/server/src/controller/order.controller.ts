import type { Request, Response } from "express";
import orderModel, { IOrder } from "../model/order.model";

export const saveOrder = async (req: Request, res: Response) => {
  const data = req.body;

  const filteredOrderData = transformOrderData(data);

  await orderModel.insertMany(filteredOrderData);
  return res.send("order saved");
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
