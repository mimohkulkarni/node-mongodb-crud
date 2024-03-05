import mongoose from "mongoose";

export const Movie = mongoose.model(
  "movie",
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      genre: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
      streamingLink: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);
