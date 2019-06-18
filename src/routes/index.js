import express from 'express';
import authRoutes from './auth.route';
import numbersRoutes from './numbers.route';

const apiRoutes = express.Router();

apiRoutes.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to the Phone Number Generator API',
}));

apiRoutes.get('/v1', (req, res) => res.status(200).send({
  message: 'Welcome to version 1 of the Phone Number Generator API',
}));

apiRoutes.use('/v1/auth', authRoutes);
apiRoutes.use('/v1/numbers', numbersRoutes);

export default apiRoutes;
