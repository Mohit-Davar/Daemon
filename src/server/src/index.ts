import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import authRoutes from '@/features/auth/routes';
import chatRoutes from '@/features/chat/routes';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In a real app, you would add a middleware to verify the VS Code auth token here
// app.use(verifyAuthToken);

app.use('/api', chatRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
