import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import chatRoutes from '@/features/chat/routes';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
