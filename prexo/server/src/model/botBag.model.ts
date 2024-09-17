import { model, Schema, Types } from "mongoose";

interface IBotBag {
  bagId: string;
  status: "Open" | "Pre-Closure" | "Closed";
  dateOfClosure?: Date;
  max?: number;
  valid?: number;
  invalid?: number;
  duplicate?: number;
  total?: number;
  orders: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const BotBagSchema = new Schema(
  {
    bagId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Open", "Pre-Closure", "Closed"],
      default: "Open",
    },
    dateOfClosure: {
      type: Date,
    },
    max: {
      type: Number,
      default: 40,
    },
    valid: {
      type: Number,
      default: 0,
    },
    invalid: {
      type: Number,
      default: 0,
    },
    duplicate: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    orders: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const BotBagModel = model<IBotBag>("BotBag", BotBagSchema);
