import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import apiRouter from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
  });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

