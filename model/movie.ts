import mongoose, { Document, Model } from "mongoose";
import { Genre, genreSchema } from "./genre";

export interface Movie extends Document {
  title: string;
  genre: Genre;
  numberIsStock: number;
  daliyRentalRate: number;
}

interface MovieModel extends Model<Movie> {
  increaseStock(movieID: string): Promise<any>;
}

export const movieSchema = new mongoose.Schema<Movie>({
  title: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 255,
  },

  genre: {
    type: genreSchema,
    required: true,
  },

  numberIsStock: {
    type: Number,
    min: 1,
    max: 1000,
  },

  daliyRentalRate: {
    type: Number,
    min: 1,
    max: 10_000,
  },
});

// 静态方法
movieSchema.statics.increaseStock = function (movieID: string) {
  return this.updateOne({ _id: movieID }, { $inc: { numberIsStock: 1 } });
};

const MovieModel = mongoose.model<Movie, MovieModel>("Movie", movieSchema);

export default MovieModel;
