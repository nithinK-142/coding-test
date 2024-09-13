import { Schema, model } from "mongoose";

export interface IBag {
  bagId: string;
  cpc: string;
  bagDisplayName: string;
  warehouse: string;
  bagLimit: string;
  bagCategory: string;
  bagDisplay: string;
  status: string;
  creationDate: string;
}

const BagSchema = new Schema({
  bagId: { type: String, required: true, unique: true },
  cpc: { type: String, required: true },
  bagDisplayName: { type: String, required: true },
  warehouse: { type: String, required: true },
  bagLimit: { type: Number, required: true },
  bagCategory: { type: String, required: true },
  bagDisplay: { type: String, required: true },
  status: { type: String, default: "No Status" },
  creationDate: { type: Date, default: Date.now },
});

export const BagModel = model<IBag>("Bag", BagSchema);
