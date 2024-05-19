import request from "supertest";
import { server } from "../../vidly";
import { Server } from "http";
import RentalModel, { Rental } from "../../model/rental";
import mongoose from "mongoose";
import UserModel from "../../model/user";
import moment from "moment";
import MovieModel, { Movie } from "../../model/movie";
// return 401 if client is not loggin in

describe("/api/returns", () => {
  let app: Server;
  let rental: Rental;
  let customerID: mongoose.Types.ObjectId | null;
  let movieID: mongoose.Types.ObjectId | null;
  let token: string;
  let movie: Movie;
  const returnsEndpoint = "/api/returns";

  const execute = () => {
    return request(app)
      .post(returnsEndpoint)
      .set("x-auth-token", token)
      .send({ customerID, movieID });
  };

  beforeEach(async () => {
    app = server;
    customerID = new mongoose.Types.ObjectId();
    movieID = new mongoose.Types.ObjectId();
    token = new UserModel().generateAuthToken();

    movie = new MovieModel({
      _id: movieID,
      title: "movie1",
      numberIsStock: 10,
      daliyRentalRate: 2,
      genre: { name: "12345" },
    });
    await movie.save();

    rental = new RentalModel({
      customer: {
        _id: customerID,
        name: "customer1",
        phone: "phone1",
      },
      movie: { _id: movieID, title: movie.title },
      dailyRentalFee: 2,
    });

    await rental.save();
  });
  afterEach(async () => {
    await RentalModel.deleteMany({});
    await MovieModel.deleteMany({});
    await app.close();
  });

  describe("POST /", () => {
    // 所有负面情况
    it("should return 401 if client is not loggin in", async () => {
      token = "";
      const res = await execute();

      expect(res.status).toBe(401);
    });

    it("should return 400 if customerID is not provide", async () => {
      customerID = null;
      const res = await execute();

      expect(res.status).toBe(400);
    });

    it("should return 400 if movieID is not provide", async () => {
      movieID = null;
      const res = await execute();

      expect(res.status).toBe(400);
    });

    it("should return 404 if rental is not found for this customer/movie", async () => {
      await RentalModel.deleteMany({});
      const res = await execute();

      expect(res.status).toBe(404);
    });

    it("should return 400 if rental already process", async () => {
      rental.returnDate = new Date();
      await rental.save();

      const res = await execute();

      expect(res.status).toBe(400);
    });

    // 所有正面情况
    it("should return 200 if request is valid", async () => {
      const res = await execute();
      expect(res.status).toBe(200);
    });

    it("should set the returnDate", async () => {
      const res = await execute();
      const rentalInDb = await RentalModel.findById(rental._id);

      if (rentalInDb?.returnDate && rentalInDb.rentalDate) {
        const diff =
          rentalInDb.returnDate.getTime() - rentalInDb.rentalDate.getTime();

        expect(rentalInDb.returnDate).toBeInstanceOf(Date);

        expect(diff).toBeLessThan(10 * 1000);
      }
    });

    it("should calculate the rental fee", async () => {
      rental.rentalDate = moment().add(-7, "days").toDate();
      await rental.save();

      const res = await execute();

      const rentalInDb = await RentalModel.findById(rental);
      if (rentalInDb && rentalInDb.rentalFee)
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it("movie stock should increase 1", async () => {
      const res = await execute();

      const movieInDb = await MovieModel.findById(movieID);
      if (movieInDb)
        expect(movieInDb.numberIsStock).toBe(movie.numberIsStock + 1);
    });

    it("should return a rental detail", async () => {
      const res = await execute();

      const rentalInDb = await RentalModel.findById(rental._id);

      if (rentalInDb) {
        expect(Object.keys(res.body)).toEqual(
          expect.arrayContaining([
            "returnDate",
            "rentalDate",
            "rentalFee",
            "customer",
            "movie",
          ])
        );
      }
    });
  });
});
