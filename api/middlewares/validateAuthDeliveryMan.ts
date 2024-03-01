import { verifyToken } from "../config/tokens";
import { Request, Response, NextFunction } from "express";

interface AuthToken {
  email: string;
  name: string;
  last_name: string;
  profile_photo: string;
  is_admin: boolean;
}

const validateAuthDeliveryMan = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token not provided" });
  }
  const user = verifyToken(token) as AuthToken;

  if (user.is_admin) {
    return res.status(403).json({ error: "Not authorized" });
  }
  next();
  return;
};

export { validateAuthDeliveryMan };
