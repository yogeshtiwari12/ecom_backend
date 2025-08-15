import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDb = async (): Promise<void> => {  // this is named export
  try {
   await mongoose.connect(process.env.MONGO_URI as string);

  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDb  

