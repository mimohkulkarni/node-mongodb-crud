import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import APIError from "../api-error";

const JWT_SECRET = process.env.JWT_SECRET || "JWT_secret";

export async function jwtTokenVerify(token: string): Promise<any> {
  const valid = await verify(token, JWT_SECRET);
  return valid;
}

export const authorizeUser = async (req: any, res: any, next: any) => {
  let token = null;
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts.pop();
    }
  }

  try {
    if (token) {
      const { role } = await jwtTokenVerify(token);
      if (!role || role !== "admin") {
        throw new APIError(
          "Invalid Token",
          "FORBIDDEN_ACTION",
          StatusCodes.FORBIDDEN
        );
      }
    } else
      throw new APIError(
        "Invalid Token",
        "FORBIDDEN_ACTION",
        StatusCodes.FORBIDDEN
      );
  } catch (error: any) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: (error as Error).message, code: 401 });
  }
  return next();
};
