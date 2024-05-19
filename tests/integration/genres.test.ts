import request from "supertest";
import { server } from "../../vidly"; // 导入 server 变量
import GenreModel from "../../model/genre";
import jwt from "jsonwebtoken";
import c from "config";

describe("/api/games/genres", () => {
  const genreRouter = "/api/games/genres";
  let app: any;

  beforeEach(() => {
    app = server;
  });

  afterEach(async () => {
    await GenreModel.deleteMany({});
    server.close();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await GenreModel.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const genres = await request(app).get("/api/games/genres"); // 使用 app 发送请求
      expect(genres.status).toBe(200);
      expect(genres.body.length).toBe(2);
      expect(
        genres.body.some((g: { name: string }) => g.name === "genre1")
      ).toBe(true);
      expect(
        genres.body.some((g: { name: string }) => g.name === "genre2")
      ).toBe(true);
    });
  });

  describe("GET /:id", () => {
    it("should return 404 if genreId is not exist", async () => {
      const res = await request(app).get(`/api/games/genres/1`);

      expect(res.status).toBe(404);
    });

    it("should return genre if genreId is exist", async () => {
      const genre = new GenreModel({ name: "genre1" });
      const newGenre = await genre.save();

      const res = await request(app).get(`/api/games/genres/${newGenre._id}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("genre1");
    });
  });

  describe("POST /", () => {
    it("should return 401 if clent not loggin", async () => {
      const result = await request(app)
        .post(genreRouter)
        .send({ username: "mosh" });

      expect(result.status).toBe(401);
    });

    it("should return 400 if req.name length is less than 5", async () => {
      const token = jwt.sign({ username: "ahthor1" }, c.get("jwtPrivateKey"));

      const result = await request(app)
        .post(genreRouter)
        .set("x-auth-token", token)
        .send({ name: "1234" });

      expect(result.status).toBe(400);
    });

    it("should return 400 if req.name length is more than 50", async () => {
      const token = jwt.sign({ username: "ahthor1" }, c.get("jwtPrivateKey"));
      const name = Array(52).join("a");

      const result = await request(app)
        .post(genreRouter)
        .set("x-auth-token", token)
        .send({ name: name });

      expect(result.status).toBe(400);
    });

    it("should save a genre if req is valid", async () => {
      const token = jwt.sign({ username: "ahthor1" }, c.get("jwtPrivateKey"));

      const result = await request(app)
        .post(genreRouter)
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      const genre = await GenreModel.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return a genre if req is valid", async () => {
      const token = jwt.sign({ username: "ahthor1" }, c.get("jwtPrivateKey"));

      const respond = await request(app)
        .post(genreRouter)
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      expect(respond.body).toHaveProperty('_id')
    });
  });
});
