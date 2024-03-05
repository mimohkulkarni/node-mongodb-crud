import APIError from "../api-error";
import { Movie } from "../model";

export const getAllMovies = async () => {
  const movies = await Movie.find({});
  if (!movies) {
    return {
      message: "Movies not found",
    };
  }
  return movies;
};

export const searchMovie = async ({ query }: { query: string }) => {
  if (!query || query.length < 3) {
    throw new APIError("Invalid search query", "INVALID_DATA", 400);
  }
  const movies = await Movie.find({
    title: { $regex: ".*" + query + ".*", $options: "i" },
  });

  if (!movies) {
    return {
      message: "Movies not found",
    };
  }

  return movies;
};

export const addMovie = async ({ title, genre, year, streamingLink }) => {
  try {
    const movie = new Movie({
      title,
      genre,
      year,
      streamingLink,
    });

    await movie.save();
    return movie;
  } catch (e) {
    throw new APIError((e as APIError).message, (e as APIError).code);
  }
};

export const updateMovie = async ({
  id,
  title,
  genre,
  year,
  streamingLink,
}: {
  id: string;
  title: string;
  genre: string;
  year: number;
  streamingLink: string;
}) => {
  const movie = await Movie.findById(id);
  if (!movie) {
    throw new APIError("Movie not found", "INVALID_DATA", 400);
  }
  movie.title = title;
  movie.genre = genre;
  movie.year = year;
  movie.streamingLink = streamingLink;
  await movie.save();
  return movie;
};

export const deleteMovie = async ({ id }) => {
  const movie = await Movie.findById(id);
  if (!movie) {
    throw new APIError("Movie not found", "INVALID_DATA", 400);
  }
  await movie.deleteOne();
  return {
    message: "Movie deleted successfully",
  };
};
