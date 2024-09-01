import mongoose, { Document, Schema } from "mongoose";

export interface IEmployee extends Document {
  _id: mongoose.Types.ObjectId;
  f_Image: string;
  f_Name: string;
  f_Email: string;
  f_Mobile: string;
  f_Designation: string;
  f_Gender: string;
  f_Course: {
    _id: mongoose.Types.ObjectId;
    f_CourseName: string;
  }[];
  f_CreatedAt: Date;
}

const EmployeeSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  f_Image: { type: String },
  f_Name: { type: String, required: true },
  f_Email: { type: String, required: true },
  f_Mobile: { type: String, required: true },
  f_Designation: { type: String, required: true },
  f_Gender: { type: String, required: true },
  f_Course: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      f_CourseName: { type: String, required: true },
    },
  ],
  f_CreatedAt: { type: Date, default: Date.now },
});

export const EmployeeModel = mongoose.model<IEmployee>(
  "Employee",
  EmployeeSchema
);
