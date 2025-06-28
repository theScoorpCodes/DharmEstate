import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/Error.js";
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
    console.log("Valid password:", validPassword);
    if (!validPassword) {
      console.log("Invalid password for user:", validUser.email);
      next(errorHandler(401, "Wrong credentials"));
      return;
    }

    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET
    );

    const { password: pass, ...others } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (error) {
    next(error);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET
      );
      const { password: pass, ...others } = user._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(others);
    } else {
      const generatedPassword = bcryptjs.hashSync(
        Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8),
        10
      );
      const newUser = new User({
        password: generatedPassword,
        email: req.body.email,
        username: req.body.username.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-5),
        avatar: req.body.photo,
      });
      await newUser.save();
      const { password: pass, ...others } = newUser._doc;

      const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_SECRET
      );
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(201)
        .json(others);
    }
  } catch (error) {
    next(error);
  }
};

const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User signed out successfully");
  } catch (error) {
    next(error);
  }
};

export { signup, signin, googleAuth, signout };
