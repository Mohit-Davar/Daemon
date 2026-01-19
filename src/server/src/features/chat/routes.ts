import { Router } from 'express';

import { handleChat } from '@/features/chat/controller';
import { verifyAuthToken } from '@/features/chat/middleware';

const router = Router();

router.post('/chat', verifyAuthToken, handleChat);

export default router;
