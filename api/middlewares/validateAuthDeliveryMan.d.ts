import { verifyToken } from "../controllers/users.controllers";
import { Request, Response, NextFunction} from "express";


const validateAuthDeliveryMan = (req : Request, res: Response, next : NextFunction) =>{
  const token: string | undefined = req.cookies.token;

  if (!token) {
    
    return next();
  }
  const user = verifyToken(token);

  if (user.isAdmin) {
    return res.status(403).json({ error: "No esta autorizado" });
  }
  next();
}


export {validateAuthDeliveryMan}