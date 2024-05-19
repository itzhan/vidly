import { NextFunction, Request, Response } from "express";

function authorization(req: Request, res: Response, next: NextFunction) {
  console.log("验证成功");
  next();
}

export default authorization
