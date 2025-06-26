import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
    const {username, email, password} = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });
    try {
        await newUser
          .save()
          .then((user) => {
            res.status(201).json({
              message: "User created successfully",
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "Error creating user",
              error,
            });
          });
    } catch (error) {
        res.status(500).json(error.message);
    }



    
}