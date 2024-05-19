import e, { Request, Response } from "express";
import GenreModel, { isValidGenre } from "../model/genre";
import auth from "../middleware/auth";
import { admin } from "../middleware/admin";
import mongoose from "mongoose";
import validataObjectId from "../middleware/validataObjectId";

export const genreRouter = e.Router();

// 获取数据
genreRouter.get("/", async (req: Request, res: Response) => {
  const genres = await GenreModel.find();
  res.send(genres);
});

genreRouter.get(
  "/:id",
  validataObjectId,
  async (req: Request, res: Response) => {
    const genre = await GenreModel.findById(req.params.id);

    if (!genre) res.status(404).send("The genreId not exist");

    res.send(genre);
  }
);
// 增加数据
genreRouter.post("/", auth, async (req: Request, res: Response) => {
  // 检查传入的数据是否符合条件
  const { error } = isValidGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let genre = new GenreModel({
    name: req.body.name,
  });

  genre = await genre.save();
  res.send(genre);
});
// 更新数据
genreRouter.put("/:id", async (req: Request, res: Response) => {
  // 验证传入来的数据
  const { error } = isValidGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // 进行更新
  try {
    const update = await GenreModel.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    res.send(update);
  } catch (error) {
    return res.status(404).send("资源不存在");
  }
});

genreRouter.delete(
  "/:id",
  [auth, admin],
  async (req: Request, res: Response) => {
    try {
      const deleteData = await GenreModel.findByIdAndDelete(req.params.id, {
        new: true,
      });
      res.send(deleteData);
    } catch (error) {
      return res.status(400).send("要删除的id不存在");
    }
  }
);
