import { body } from 'express-validator';

export const postCreateValidation = [
  body('title', 'Title is not valid').isLength({ min: 3 }).isString(),
  body('text', 'Text is not valid').isLength({ min: 10 }).isString(),
  body('tags', 'Tags must be a astring').optional().isString(),
  body('imgUrl', 'URL is not valid').optional().isString(),
]