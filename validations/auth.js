import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Email is not valid').isEmail(),
  body('password', 'Password min 5 symbols').isLength({ min: 5 }),
]

export const registerValidation = [
  body('email', 'Email is not valid').isEmail(),
  body('password', 'Password min 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Name min 3 symbols').isLength({ min: 3 }),
  body('avatarUrl', 'URL is not valid').optional().isURL(),
]