import e, { Request, Response } from "express";
import customerRouter from "../router/customers";
import movieRouter from "../router/movies";
import rentalRouter from "../router/rentals";
import userRouter from "../router/users";
import authRouter from "../router/auth";
import { genreRouter } from "../router/genres";
import returnRouter from "../router/rentuns";

export function router(app: e.Application) {
  app.get("/", (req: Request, res: Response) => {
    res.send("App");
    console.log("app");
  });
  app.use("/api/games/genres", genreRouter);
  app.use("/api/customers", customerRouter);
  app.use("/api/movies", movieRouter);
  app.use("/api/rentals", rentalRouter);
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use('/api/returns', returnRouter)
}
