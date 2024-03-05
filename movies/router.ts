import express, { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  addMovie,
  deleteMovie,
  getAllMovies,
  searchMovie,
  updateMovie,
} from "./module";
import { authorizeUser } from "../utils/auth";

const router = express.Router();

router.get<{}, any, any>(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send(await getAllMovies());
    } catch (err) {
      next(err);
    }
  }
);

router.post<{}, any, any>(
  "/",
  authorizeUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.CREATED).send(await addMovie({ ...req.body }));
    } catch (err) {
      next(err);
    }
  }
);

router.put<{}, any, any>(
  "/:id",
  authorizeUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(StatusCodes.OK).send(await updateMovie({ ...req.body, id }));
    } catch (err) {
      next(err);
    }
  }
);

router.delete<{}, any, any>(
  "/:id",
  authorizeUser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      res.status(StatusCodes.OK).send(await deleteMovie({ id }));
    } catch (err) {
      next(err);
    }
  }
);

export default router;
