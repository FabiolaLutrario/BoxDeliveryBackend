import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

const secretKey : string | undefined = process.env.JWT_SECRET_KEY

interface Payload {
  [key: string]: string;
}

function createToken(payload : Payload): string| undefined {

  if (!secretKey)throw new Error("Secret Key not found");

  const token: string = jwt.sign(payload, secretKey);

  return token

}


const verifyToken = (token : string) => {
  
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token not provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
    return;
  }
};

export{
  createToken, verifyToken
}


