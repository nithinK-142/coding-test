import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  _id?: string;
  email: string;
  username: string;
  password: string;
  availableMoney: number;
  purchasedItems: string[];
  refreshToken: String;
  refreshTokenExpiry: Date;
}

const loginSchema = new Schema({
  f_sno: Number,
  f_userName: String,
  f_Pwd: String,
});

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  availableMoney: { type: Number, default: 5000 },
  purchasedItems: [
    { type: Schema.Types.ObjectId, ref: "Product", default: [] },
  ],
  refreshToken: { type: String },
  refreshTokenExpiry: { type: Date },
});

export const UserModel = model<IUser>("User", UserSchema);
