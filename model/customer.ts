import Joi from "joi";
import mongoose, { Document } from "mongoose";

export interface Customer extends Document {
  isGold: boolean;
  name: string;
  phone: string;
}

export const customerSchema = new mongoose.Schema<Customer>({
  isGold: { type: Boolean, default: false },
  name: { type: String, minlength: 3, maxlength: 10, required: true },
  phone: { type: String, minlength: 5, maxlength: 11, required: true },
});
const CustomerModel = mongoose.model<Customer>("Cusomer", customerSchema);

export function isValidNewdata(data: Customer) {
  const schema = Joi.object<Customer>({
    isGold: Joi.boolean().required(),
    name: Joi.string().min(3).max(10).required(),
    phone: Joi.string().min(5).max(10).required(),
  });

  return schema.validate(data);
}

export function isValidUpdata(data: Customer) {
  const schema = Joi.object<Customer>({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).max(10),
    phone: Joi.string().min(5).max(10),
  });

  return schema.validate(data);
}

export default CustomerModel;
