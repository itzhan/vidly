import jwt from "jsonwebtoken";
import UserModel from "../../model/user";
import c from "config";

describe("user", () => {
  it("should return a jwt token", () => {
    const user = new UserModel({ _id: 1, isAdmin: true });

    const token = user.generateAuthToken();
    const result = jwt.verify(token, c.get("jwtPrivateKey"));

    expect(result).toMatchObject({ _id: user._id.toString(), isAdmin: user.isAdmin });
  });
});
