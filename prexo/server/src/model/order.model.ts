import { Schema, model } from "mongoose";

export interface IOrder {
  orderId: string;
  orderDate: Date;
  orderTimestamp: string;
  orderStatus: string;
  buybackCategory: string;
  partnerId: string;
  partnerEmail: string;
  partnerShop: string;
  itemId: string;
  oldItemDetails: string;
  imei: string;
  gepOrder: boolean; // Assuming this is a boolean from the sample data (TRUE/FALSE)s
  baseDiscount: number;
  partnerPurchasePrice: number;
  trackingId: string;
  deliveryDate: Date;
}

const OrderSchema = new Schema({
  orderId: { type: String, required: true },
  orderDate: { type: Date, required: true },
  orderTimestamp: { type: String, required: true }, // Timestamp in string format
  orderStatus: { type: String, required: true },
  buybackCategory: { type: String, required: true },
  partnerId: { type: String, required: true },
  partnerEmail: { type: String, required: true },
  partnerShop: { type: String, required: true },
  itemId: { type: String, required: true },
  oldItemDetails: { type: String, required: true },
  imei: { type: String, required: true },
  gepOrder: { type: Boolean, required: true }, // Assuming it's boolean
  baseDiscount: { type: Number, required: true },
  partnerPurchasePrice: { type: Number, required: true },
  trackingId: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
});

const Order = model<IOrder>("Order", OrderSchema);

export default Order;
