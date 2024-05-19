import Joi from "joi";
import mongoose from "mongoose";

export interface Genre extends Document {
  name: string;
}

// 连接数据库mongoose
export const genreSchema = new mongoose.Schema<Genre>({
  name: { type: String, required: true, min: 5, max: 50},
});
const GenreModel = mongoose.model<Genre>("Genre", genreSchema);

//设置验证规则
export function isValidGenre(genre: Genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre);
}

export default GenreModel;
