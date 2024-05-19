import c from "config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Please provite token");

  try {
    req.user = jwt.verify(token, c.get("jwtPrivateKey"));
    // 判断发送的token中是否包含我们想要的数字签名
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }

  next();
}

export default auth;

