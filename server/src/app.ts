import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes"

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (_req, res) => {
    res.send('HyprTrain API is running');
});

export default app;