import mongoose, { Document, Schema } from "mongoose";

export interface IEmployee extends Document {
  f_Id: number;
  f_Image: string;
  f_Name: string;
  f_Email: string;
  f_Mobile: string;
  f_Designation: string;
  f_gender: string;
  f_Course: string;
  f_Createdate: Date;
}

const EmployeeSchema: Schema = new Schema({
  f_Id: { type: Number, required: true, unique: true },
  f_Image: { type: String },
  f_Name: { type: String, required: true },
  f_Email: { type: String, required: true },
  f_Mobile: { type: String, required: true },
  f_Designation: { type: String, required: true },
  f_gender: { type: String, required: true },
  f_Course: { type: String, required: true },
  f_Createdate: { type: Date, default: Date.now },
});

export const EmployeeModel = mongoose.model<IEmployee>(
  "Employee",
  EmployeeSchema
);
