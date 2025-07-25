import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes";
import programRoutes from "./routes/programRoutes";
import workoutDayRoutes from "./routes/workoutDayRoutes";
import workoutExerciseRoutes from "./routes/WorkoutExerciseRoutes";

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', programRoutes);
app.use('/api', workoutDayRoutes);
app.use('/api', workoutExerciseRoutes);

app.get('/', (_req: Request, res: Response): void => {
    res.send('HyprTrain API is running');
});

export default app;