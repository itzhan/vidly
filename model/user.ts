import Joi from "joi";
import mongoose from "mongoose";
import passwordComplexity from "joi-password-complexity";
import jwt from "jsonwebtoken";
import c from "config";

interface User {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  generateAuthToken(): string;
}

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 255,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
  },
  isAdmin: {
    type: Boolean,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    c.get("jwtPrivateKey")
  );
  return token;
};

const UserModel = mongoose.model("User", userSchema);

export function isValiUser(user: User) {
  const complexityOptions = {
    min: 8, // 密码最小长度
    max: 26, // 密码最大长度
    lowerCase: 1, // 至少包含一个小写字母
    upperCase: 1, // 至少包含一个大写字母
    numeric: 1, // 至少包含一个数字
    requirementCount: 4, // 至少满足以上四个条件
  };

  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: passwordComplexity(complexityOptions),
  });

  return schema.validate(user);
}

export default UserModel;
