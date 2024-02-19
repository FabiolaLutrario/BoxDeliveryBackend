import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || "Vancouver";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, secretKey);
};
