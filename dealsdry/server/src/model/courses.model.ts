import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  f_CourseName: string;
  f_CreatedAt: Date;
}

const CourseSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  f_CourseName: { type: String, required: true, unique: true },
  f_CreatedAt: { type: Date, default: Date.now },
});

export const CourseModel = mongoose.model<ICourse>("Course", CourseSchema);
