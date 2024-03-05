import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey: string | undefined = process.env.JWT_SECRET_KEY;

interface Payload {
  [key: string]: string | number | boolean | undefined | null;
}

function createToken(payload: Payload, duration?: string) {
  if (!secretKey) throw new Error("Secret Key not found");

  if (!duration) {
    return jwt.sign(payload, secretKey);
  } else {
    const token: string = jwt.sign(payload, secretKey, {
      expiresIn: `${duration}`,
    });
    return token;
  }
}

const verifyToken = (token: string) => {
  if (!secretKey) throw new Error("Secret Key not found");
  return jwt.verify(token, secretKey);
};

export { createToken, verifyToken };
