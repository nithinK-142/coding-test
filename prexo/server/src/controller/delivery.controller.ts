import type { Request, Response } from "express";
import { DeliveryModel, IDelivery } from "../model/delivery.model";

export const saveDelivery = async (req: Request, res: Response) => {
  const data = req.body;

  const filteredDeliveryData = transformDeliveryData(data);

  try {
    await DeliveryModel.insertMany(filteredDeliveryData);
    return res.send("Delivery data saved successfully");
  } catch (error) {
    console.error("Error saving delivery data:", error);
    return res.status(500).send("Error saving delivery data");
  }
};

export const getDeliveries = async (req: Request, res: Response) => {
  try {
    const deliveries = await DeliveryModel.find();
    console.log(deliveries);
    return res.send(deliveries);
  } catch (error) {
    console.log(error);
  }
};

const transformDeliveryData = (rawData: any[]): IDelivery[] => {
  return rawData.map((delivery) => ({
    trackingId: delivery["Tracking ID"],
    orderId: delivery["Order ID"],
    orderDate: new Date(delivery["Order Date"]),
    itemId: delivery["Item ID"],
    gepOrder: delivery["GEP Order"] === "TRUE" ? "TRUE" : "FALSE", // Ensure it’s a string
    imei: delivery["IMEI"],
    partnerPurchasePrice: Number(delivery["Partner Purchase Price"]),
    partnerShop: delivery["Partner Shop"],
    baseDiscount: delivery["Base Discount"]
      ? Number(delivery["Base Discount"])
      : undefined,
    diagnosticsDiscount: delivery["Diagnostics Discount"]
      ? Number(delivery["Diagnostics Discount"])
      : undefined,
    storageDiscount: delivery["Storage Discount"]
      ? Number(delivery["Storage Discount"])
      : undefined,
    buybackCategory: delivery["Buyback Category"],
    doorstepDiagnostics: delivery["Doorstep Diagnostics"] || undefined,
  }));
};
