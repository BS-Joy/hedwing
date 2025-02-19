import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongodb connected: ", conn.connection.host);
  } catch (err) {
    console.log("Mongodb connection error: ", err);
    throw new Error(err);
  }
};
