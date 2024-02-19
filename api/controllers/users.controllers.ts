import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const secretKey = process.env.JWT_SECRET_KEY ?? "secret key";
import * as userService from "../services/user.services";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const getAllUsers = (_req: Request, res: Response) => {
  userService
    .getAll()
    .then((users: object) => res.status(200).send(users))
    .catch((err: Error) => res.send(err));
};

export const registerUser = (req: Request, res: Response) => {
  userService
    .register(req.body)
    .then(() => res.status(201).send("Created"))
    .catch((err: Error) => res.status(500).send(err.message));
};

export const loginUser = (req: Request, res: Response) => {
  userService
    .login(req.body)
    .then((response) =>
      res.cookie("auth-token", response.token).send(response.message)
    )
    .catch((err) => res.status(401).send(err.message));
};
export const getDeliverymen = (_req: Request, res: Response) => {
  userService
    .getDeliverymen()
    .then((deliverymen) => res.status(200).send(deliverymen))
    .catch((err) => res.status(400).send(err));
};

export const getOneDeliverymen = (req: Request, res: Response) => {
  userService
    .getOneDeliverymen(req.params.id)
    .then((deliverymen) => {
      if (!deliverymen || deliverymen.isAdmin) return res.sendStatus(204);
      return res.status(200).send(deliverymen);
    })
    .catch((err) => res.status(400).send(err));
};

export const deleteDeliverymen = (req: Request, res: Response) => {
  userService
    .deleteDeliverymen(req.body.email)
    .then(() => res.status(200).send("Deliverymen deleted successfully"))
    .catch(() =>
      res.status(500).send("Failure when trying to delete delivery man")
    );
};

export const deleteAdmin = (req: Request, res: Response) => {
  const { email } = req.body;

  userService
    .deleteAdmin(email)
    .then((response) => res.status(200).send(response))
    .catch((err) => res.status(500).send(err.message));
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("auth-token");
  res.sendStatus(200);
};
