import { Request, Response } from 'express';
import { db } from '@/db';
import { users } from '@/db/schema';

interface SyncUserRequest {
  username: string;
  photo?: string;
}

export const syncUser = async (req: Request, res: Response) => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ error: 'User ID missing' });
  }

  const { username, photo } = req.body as SyncUserRequest;

  try {
    await db
      .insert(users)
      .values({
        id: userId,
        username,
        photo: photo ?? null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          username,
          photo: photo ?? null,
          updatedAt: new Date(),
        },
      });

    console.log(`[Auth] Synced user: ${username} (${userId})`);

    return res.json({ success: true, message: 'User synced successfully' });
  } catch (e) {
    console.error('[Auth] Failed to sync user', e);
    return res.status(500).json({ error: 'Failed to sync user' });
  }
};
