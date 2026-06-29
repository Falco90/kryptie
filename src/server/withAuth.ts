import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from './auth';

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    (req as any).user = user;

    return handler(req, res);
  };
}
