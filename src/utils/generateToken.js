import jwt from "jsonwebtoken";

const generateToken = userId => {
  return jwt.sign({ userId }, "thisIsASecret", { expiresIn: "7 days" });
};

export default generateToken;
