import e, { Request, Response } from "express";
import UserModel, { isValiUser } from "../model/user";
import _ from "lodash";
import bcrypt from "bcrypt";
import auth from "../middleware/auth";

const userRouter = e.Router();

userRouter.get("/me", auth, async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user._id).select("-password");
  if (!user) return res.status(404).send("用户不存在");

  res.send(user);
});

userRouter.post("/", async (req: Request, res: Response) => {
  const { error } = isValiUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await UserModel.findOne({ email: req.body.email });
  if (user) return res.status(400).send("用户已注册");

  user = new UserModel(_.pick(req.body, ["name", "email", "password"]));

  try {
    // 对密码进行哈希
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

export default userRouter;
