import express, { Request, Response, Application } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes";
import programRoutes from "./routes/programRoutes";
import workoutDayRoutes from "./routes/workoutDayRoutes";
import workoutExerciseRoutes from "./routes/WorkoutExerciseRoutes";
import exerciseRoutes from "./routes/exerciseRoutes";
import dailyNoteRoutes from "./routes/dailyNoteRoutes";
import exerciseNoteRoutes from "./routes/exerciseNoteRoutes";
import exerciseLogRoutes from "./routes/exerciseLogRoutes";
import exerciseSetRoutes from "./routes/exerciseSetRoutes";
import muscleGroupRoutes from "./routes/muscleGroupRoutes";
import pool from './db/db';

const app: Application = express();

const allowed = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
};


app.get('/debug/db', async (_req, res) => {
  try {
    const r = await pool.query('SELECT 1 as ok');
    res.json({ ok: r.rows[0]?.ok === 1 });
  } catch (e: any) {
    console.error('DB test failed:', {
      code: e.code,
      message: e.message,
      detail: e.detail,
      where: e.where,
      hint: e.hint,
      stack: e.stack,
    });
    res.status(500).json({ code: e.code, message: e.message, detail: e.detail });
  }
});

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', programRoutes);
app.use('/api', workoutDayRoutes);
app.use('/api', workoutExerciseRoutes);
app.use('/api', exerciseRoutes);
app.use('/api', dailyNoteRoutes);
app.use('/api', exerciseNoteRoutes);
app.use('/api', exerciseLogRoutes);
app.use('/api', exerciseSetRoutes);
app.use('/api', muscleGroupRoutes);

app.get('/health', (_req: Request, res: Response): void => {
    res.sendStatus(200);
});

export default app;