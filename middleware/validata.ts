import { NextFunction, Request, Response } from "express";

const validata = (validator: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = validator(req);
    if (error) return res.status(400).send(error.details[0].message);

    next();
  };
};

export default validata
