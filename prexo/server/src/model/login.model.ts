import mongoose, { Document, Schema } from "mongoose";

export interface ILogin extends Document {
  f_UserName: string;
  f_Pwd: string;
}

const LoginSchema: Schema = new Schema({
  f_UserName: { type: String, required: true, unique: true },
  f_Pwd: { type: String, required: true },
});

export const LoginModel = mongoose.model<ILogin>("Login", LoginSchema);
