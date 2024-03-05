import express, {
  Application,
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import swaggerJSDoc from "swagger-jsdoc";
import { sign } from "jsonwebtoken";
import movieRouter from "./movies/router";
import { connectToDB } from "./database";
import APIError from "./api-error";
import { StatusCodes } from "http-status-codes";
import { searchMovie } from "./movies/module";

dotenv.config();
const PORT = process.env.PORT || 7001;
const JWT_SECRET = process.env.JWT_SECRET || "JWT_secret";

const app: Application = express();
app.use(express.json());

const swaggerDefinition = yaml.load("./apidoc/swagger.yaml");
const options = {
  swaggerDefinition,
  apis: ["./apidoc/swagger.yaml"],
};
const swaggerDocument = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectToDB();

app.use("/movies", movieRouter);

app.get<{}, any, any>(
  "/search",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q } = req.query;
      res.status(StatusCodes.OK).send(await searchMovie({ query: q }));
    } catch (err) {
      next(err);
    }
  }
);

app.get<{}, any, any>(
  "/get-admin-token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = sign({ role: "admin" }, JWT_SECRET, {
        expiresIn: "1d",
      });
      res.status(StatusCodes.OK).send({ token });
    } catch (err) {
      next(err);
    }
  }
);

const errorRequestHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.log(`Error with route ${req.url} : ${err.message}`);
  console.error(err);
  if (err instanceof APIError) {
    res.status(err.statusCode).send({ message: err.message, code: err.code });
  } else {
    res.status(400).send({ message: err.message, code: "ERROR_CODE" });
  }
};

app.use(errorRequestHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
