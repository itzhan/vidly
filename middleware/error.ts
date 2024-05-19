import { Request, Response, NextFunction } from "express";
import "express-async-errors";
import logger from "../startup/logging";


function error(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error(err.message, err);
  res.status(500).send("Something falied.");
}

export default error;
