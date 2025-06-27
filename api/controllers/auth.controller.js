import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utils/Error.js";
import jwt from "jsonwebtoken";

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save().then((user) => {
      res.status(201).json({
        message: "User created successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({
      email,
    });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) next(errorHandler(401, "Wrong credentials"));

    const token = jwt.sign({
      id: validUser._id,
    },process.env.JWT_SECRET);

    const { password: pass, ...others } = validUser._doc;

    res.cookie("access_token", token, {
      httpOnly: true,
    }).status(200).json(others);



  } catch (error) {
    next(error);
  }
};

export { signup, signin };
