import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  courses: string;
}

const CourceSchema: Schema = new Schema({
  courses: { type: String, required: true },
});

export const CourseModel = mongoose.model<ICourse>("Cource", CourceSchema);
