import { Request, Response, NextFunction } from "express";

function asyncMiddleware(handle: (...args: any[]) => Promise<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handle(req, res);
    } catch (error) {
      next(error);
    }
  };
}

export default asyncMiddleware;
