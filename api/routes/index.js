const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
require("dotenv").config();
const secretKey = process.env.JWT_SECRET_KEY
router.post("/login",(req,res)=>{
const user = {
  id : 1,
  name:"userExample"
}

const token = jwt.sign({user},secretKey,{expiresIn : "1h"} );
res.cookie("token", token).send({token})
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado."});
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido." });
  }
};

// Ruta protegida
router.get("/private", verifyToken, (req, res) => {
  res.send({ message: "Hello World! This is a private route."});
});

module.exports = router
