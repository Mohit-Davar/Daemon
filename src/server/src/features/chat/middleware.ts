import axios from 'axios';
import { NextFunction, Request, Response } from 'express';

import { expectError } from '@/utils/expectError';

export const verifyAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized: Missing or invalid token',
    });
    return;
  }

  // For GitHub session tokens, we verify by calling the GitHub API
  const token = authHeader.split(' ')[1];
  const [error, response] = await expectError(
    axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );

  if (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      res.status(401).json({
        error: 'Unauthorized: Invalid token',
      });
    } else {
      res.status(500).json({
        error: 'Internal server error during authentication',
      });
    }
    return;
  }

  req.user = response.data.id.toString();
  next();
};
