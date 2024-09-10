import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(String(process.env.MONGODB_URI));
    console.log("MongoDB connected");
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
};

export default dbConnect;
