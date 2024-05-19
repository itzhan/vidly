import e, { Request, Response } from "express";
import RentalModel, { isValidateRental } from "../model/rental";
import CustomerModel from "../model/customer";
import MovieModel from "../model/movie";

const rentalRouter = e.Router();

rentalRouter.get("/", async (req: Request, res: Response) => {
  try {
    const rental = await RentalModel.find().sort("-rentalData");
    res.send(rental);
  } catch (error: any) {
    res.send(error.message);
  }
});

rentalRouter.post("/", async (req: Request, res: Response) => {
  const { error } = isValidateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = await CustomerModel.findById(req.body.customerId);
    const movie = await MovieModel.find({ _id: { $in: req.body.moviesId } });
    movie.map((m) => {
      if (m.numberIsStock === 0)
        return res.send(`${m.title} numberOfStock is zero`);
    });

    const rental = new RentalModel({
      customer: {
        _id: customer?._id,
        name: customer?.name,
      },

      movies: movie.map((m) => ({
        _id: m._id,
        title: m.title,
      })),
      rentalDate: req.body.rentalDate,
      returnDate: req.body.returnDate,
      rentalFee: req.body.rentalFee,
    });

    const newData = await rental.save();
    res.send(newData);

    movie.map((m) => {
      m.numberIsStock--;
      m.save();
    });
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
});

export default rentalRouter;
