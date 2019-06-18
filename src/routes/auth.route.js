import express from 'express';
import { signinSchema } from '../schemas/auth.schema';
import Validation from '../middlewares/Validation.middleware';
import AuthController from '../controllers/Auth.controller';

const authRoutes = express.Router();
const { signin } = AuthController;
const validateSignin = new Validation(signinSchema).validate;

authRoutes.post('/signin', validateSignin, signin);

export default authRoutes;
