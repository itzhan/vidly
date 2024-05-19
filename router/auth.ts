import e, { Request, Response } from "express";
import UserModel from "../model/user";
import _ from "lodash";
import bcrypt from "bcrypt";
import Joi from "joi";

const authRouter = e.Router();

authRouter.post("/", async (req: Request, res: Response) => {
  const { error } = isValiAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await UserModel.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken()

  res.send(token);
});

function isValiAuth(user: any) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}

export default authRouter;
