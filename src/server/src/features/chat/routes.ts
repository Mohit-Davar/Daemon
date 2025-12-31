import { Router } from 'express';

import { handleChat } from '@/features/chat/controller';

const router = Router();

router.post('/chat', handleChat);

export default router;
