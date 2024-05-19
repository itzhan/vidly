import e, { Request, Response } from "express";
import Joi from "joi";
import MovieModel, { Movie } from "../model/movie";
import GenreModel from "../model/genre";

const movieRouter = e.Router();

// 获取数据
movieRouter.get("/", async (req: Request, res: Response) => {
  try {
    const movies = await MovieModel.find();
    res.send(movies);
  } catch (error: any) {
    return res.send(error.message);
  }
});

// 添加数据
movieRouter.post("/", async (req: Request, res: Response) => {
  const { error } = isValidMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await GenreModel.findById(req.body.genreId);
  if (!genre) return res.status(400).send("id不存在");

  try {
    let movie = new MovieModel({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberIsStock: req.body.numberIsStock,
      daliyRentalRate: req.body.daliyRentalRate,
    });
    movie = await movie.save();
    res.send(movie);
  } catch (error: any) {
    res.send(error.message);
  }
});

function isValidMovie(movie: Movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    genreId: Joi.string().required(),
    numberIsStock: Joi.number().min(0).max(10_000).required(),
    daliyRentalRate: Joi.number().min(0).max(10_000_000).required(),
  });

  return schema.validate(movie);
}

export default movieRouter;
