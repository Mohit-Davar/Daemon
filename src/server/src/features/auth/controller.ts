import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { SyncUserRequest, UserRecord } from './types';

const DATA_PATH = path.join(process.cwd(), 'data', 'users.json');

async function getUsers(): Promise<Record<string, UserRecord>> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

async function saveUsers(users: Record<string, UserRecord>) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2));
}

export const syncUser = async (req: Request, res: Response) => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ error: 'User ID missing' });
  }

  const { username, photo } = req.body as SyncUserRequest;

  const users = await getUsers();

  users[userId] = {
    id: userId,
    username,
    photo,
    lastSyncedAt: new Date().toISOString(),
  };

  await saveUsers(users);

  console.log(`[Billing] Synced user: ${username} (${userId})`);

  return res.json({
    success: true,
    message: 'User synced successfully',
  });
};
