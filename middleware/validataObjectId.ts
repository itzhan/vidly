import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

const validataObjectId = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid ID.");
  next();
};

export default validataObjectId;
