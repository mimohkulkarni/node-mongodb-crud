import mongoose from "mongoose";
import { Movie } from "./model";

export const connectToDB = () => {
  mongoose
    .connect("mongodb://localhost:27017/dazn")
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("Database not connected");
      console.log(err);
    });
};

export const emptyDB = () => {
  return Movie.deleteMany({});
};
