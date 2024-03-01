import { verifyToken } from "../config/tokens";
import { Request, Response, NextFunction } from "express";
interface payloadContent {
  email: string;
  name: string;
  last_name: string;
  profile_photo: string;
  is_admin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      payload?: payloadContent;
    }
  }
}

const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;

  if (!token)
    return res
      .status(401)
      .json({ message: "Authentication token not provided" });

  const user = verifyToken(token);

  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }

  req.payload = user as payloadContent;

  next();
  return;
};

export { validateAuth };
