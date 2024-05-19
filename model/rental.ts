import mongoose, { Document, Model } from "mongoose";
import { Customer } from "./customer";
import { Movie } from "./movie";
import Joi from "joi";
import moment from "moment";

export interface Rental extends Document {
  customer: Customer;
  movie: Movie;
  dailyRentalFee: number;
  rentalDate: Date;
  returnDate: Date;
  rentalFee: number;
}

interface RentalModel extends Model<Rental> {
  lookup(customerID: string, movieID: string): Promise<Rental | null>;
}

// 连接到服务器
const rentalSchema = new mongoose.Schema<Rental>({
  customer: {
    type: new mongoose.Schema({
      name: { type: String, minlength: 3, maxlength: 10, required: true },
    }),
    requierd: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 255,
      },
    }),
    required: true,
  },
  dailyRentalFee: {
    type: Number,
  },
  rentalDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

// 添加静态方法
rentalSchema.statics.lookup = function (customerID: string, movieID: string) {
  return this.findOne({
    "customer._id": customerID,
    "movie._id": movieID,
  });
};

// 添加实例方法
rentalSchema.methods.calculation = function () {
  this.returnDate = new Date();
  const rentalDays = moment().diff(this.rentalDate, "days");
  this.rentalFee = this.dailyRentalFee * rentalDays;
};

export const RentalModel = mongoose.model<Rental, RentalModel>(
  "Rental",
  rentalSchema
);

export function isValidateRental(rental: Rental) {
  const schema = Joi.object({
    customerID: Joi.string().required(),
    moviesID: Joi.array().items(Joi.string()).required(),
  });

  return schema.validate(rental);
}

export default RentalModel;
