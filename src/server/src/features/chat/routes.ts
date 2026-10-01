import { Router } from 'express';

import {
  deleteConversation,
  getConversations,
  getMessages,
  handleChat,
  renameConversation,
} from '@/features/chat/controller';
import { verifyAuthToken } from '@/features/chat/middleware';

const router = Router();

// Chat
router.post('/chat', verifyAuthToken, handleChat);

// Conversations
router.get('/conversations', verifyAuthToken, getConversations);
router.delete('/conversations/:id', verifyAuthToken, deleteConversation);
router.patch('/conversations/:id', verifyAuthToken, renameConversation);

// Messages
router.get('/conversations/:id/messages', verifyAuthToken, getMessages);

export default router;
