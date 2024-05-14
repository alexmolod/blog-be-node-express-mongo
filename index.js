import multer from 'multer';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import { postCreateValidation } from './validations/posts.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';
import { loginValidation, registerValidation } from './validations/auth.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB OK'))
  .catch(err => console.log('DB ERR', err));

const app = express();

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: multerStorage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/posts', PostController.postGetAll);
app.get('/posts/:id', PostController.postGetOne);
app.delete('/posts/:id', checkAuth, PostController.postRemove);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.postCreate);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.postUpdate);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) console.log(err);

  console.log('Server OK');
});