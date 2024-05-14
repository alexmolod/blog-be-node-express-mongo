import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });
  
    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;
  
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) res.status(404).json({
      message: 'Wrong User or Pass!',
    })
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(404).json({
        message: 'Wrong Pass or User!'
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;
  
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Oops! Something went wrong! Please email to admin!'
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User dont exist!'
      });
    }

    const { passwordHash, ...userData } = user._doc;
  
    res.json(userData);
  } catch (error) {
    res.status(500).json(error);
  }
};
