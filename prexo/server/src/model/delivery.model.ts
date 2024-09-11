import { Schema, model } from "mongoose";

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

const DeliverySchema = new Schema({
  trackingId: { type: String, required: true },
  orderId: { type: String, required: true },
  orderDate: { type: Date, required: true },
  itemId: { type: String, required: true },
  gepOrder: { type: String, required: true },
  imei: { type: String, required: true },
  partnerPurchasePrice: { type: Number, required: true },
  partnerShop: { type: String, required: true },
  baseDiscount: { type: Number, required: false },
  diagnosticsDiscount: { type: Number, required: false },
  storageDiscount: { type: Number, required: false },
  buybackCategory: { type: String, required: true },
  doorstepDiagnostics: { type: String, required: false },
});

export const DeliveryModel = model<IDelivery>("Delivery", DeliverySchema);
