import 'dotenv/config';
import express, { type Request, type Response, type Express } from 'express';
import cors from 'cors';
import contributions from './src/api/contributions.js';

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
  res.json({ message: 'Backend API is running' });
});

app.use('/api/contributions', contributions);

app.listen(port, (): void => {
  console.log(`backend is listening`);
});

