import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';

import logger from './utils/logger';
import errorHandler from './middlewares/errorHandler.middleware';

config();

const app = express();
const port = process.env.PORT;

app.use(morgan('dev'));
app.use(cors({
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/*', (req, res) => {
  res.status(400).json({ status: 400, error: 'Route not found' });
});

app.use(errorHandler);

app.listen(port, () => { logger.info(`Listening on ${port}`); });

export default app;
