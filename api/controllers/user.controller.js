import { errorHandler } from "../utils/Error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

const userTest = (req, res) => {
  res.send("User contoller route is working");
};

const updateUser = async (req, res, next) => {
  if(req.user.id !== req.params.id) return next(errorHandler(403, "You are not allowed to update this user"));

  try {
    if(req.body.password){
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      }
    }, { new: true });

    const { password: pass, ...rest} = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  if(req.user.id !== req.params.id) return next(errorHandler(403, "You are not allowed to delete this user"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User deleted successfully");
  } catch (error) {
    return next(error);
  }
};

export { userTest, updateUser, deleteUser };
