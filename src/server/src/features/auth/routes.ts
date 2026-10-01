import { Router } from 'express';
import { syncUser } from './controller';
import { verifyAuthToken } from '@/features/chat/middleware';

const router = Router();

router.post('/sync', verifyAuthToken, syncUser);

export default router;
