import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to db");
    })
    .catch((e) => {
      console.log(e);
    });
};

export { db };
