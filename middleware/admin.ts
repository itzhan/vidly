import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function admin(req: Request, res: Response, next: NextFunction) {
  if (!req.user.isAdmin) return res.status(403).send("无权操作");

  next();
}
