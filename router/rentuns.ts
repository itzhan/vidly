import e, { Request, Response } from "express";
import auth from "../middleware/auth";
import RentalModel from "../model/rental";
import MovieModel from "../model/movie";
import Joi from "joi";
import validata from "../middleware/validata";
const returnRouter = e.Router();

returnRouter.post(
  "/",
  [auth, validata(isValidReturn)],
  async (req: Request, res: Response) => {
    const rental = await RentalModel.lookup(
      req.body.customerID,
      req.body.movieID
    );

    if (!rental) return res.status(404).send("Rental not found");
    if (rental.returnDate)
      return res.status(400).send("Rental already process");

    // 计算租金
    rental.calculation();
    await rental.save();
    // 增加Movie的isStockNumber
    await MovieModel.increaseStock(req.body.movieID)

    return res.send(rental);
  }
);

function isValidReturn(req: Request) {
  const schema = Joi.object({
    movieID: Joi.string().hex().length(24).required(),
    customerID: Joi.string().hex().length(24).required(),
  });

  return schema.validate(req.body);
}

export default returnRouter;
