import express from 'express';
import  { getSchema } from '../schemas/numbers.schema';
import Validation from '../middlewares/Validation.middleware';
import Authentication from '../middlewares/Authentication.middleware';
import NumbersController from '../controllers/Number.controller';

const numberRoutes = express.Router();
const { authenticate } = Authentication;
const { generate, download } = NumbersController;
const validateSignin = new Validation(getSchema).validate;

numberRoutes.get('/', authenticate, validateSignin, generate);
numberRoutes.get('/download', authenticate, validateSignin, download);

export default numberRoutes;
