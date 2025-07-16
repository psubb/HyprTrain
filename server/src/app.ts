import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('api', authRoutes);

app.get('/', (_req, res) => {
    res.send('HyprTrain API is running');
});

export default app;