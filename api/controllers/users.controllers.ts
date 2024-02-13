import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const secretKey = process.env.JWT_SECRET_KEY ?? "secret key";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token not provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
    // req.user = decoded.user;
    next();
    return;
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
    return;
  }
};

export default verifyToken;
