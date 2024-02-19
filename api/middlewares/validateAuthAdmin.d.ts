import { verifyToken } from "../config/tokens";
import { Request, Response, NextFunction} from "express";


const validateAuthAdmin = (req : Request, res: Response, next : NextFunction) =>{
  const token: string | undefined = req.cookies.token;

  const user = verifyToken(token);

  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "No esta autorizado" });
  }
  next();
}

export {validateAuthAdmin}

