import express, {
  ErrorRequestHandler,
} from 'express';
import cors, { type CorsOptions } from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes';
import { rateLimiterMiddleware } from './middleware/rateLimiter';

dotenv.config();

const app = express();

const rawCorsOrigin = process.env.CORS_ORIGIN ?? '';
const allowedOrigins = rawCorsOrigin
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || !origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));

app.use(rateLimiterMiddleware);

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

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
