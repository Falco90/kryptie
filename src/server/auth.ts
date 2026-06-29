import type { NextApiRequest } from 'next';
import magic from '@/server/magic';
import { prisma } from '@/lib/prisma';

export async function getUserFromRequest(req: NextApiRequest) {
  try {
    const token =
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Missing auth token');
    }

    const metadata = await magic.users.getMetadataByToken(token);

    if (!metadata.email) {
      throw new Error('Invalid token');
    }

    let user = await prisma.user.findUnique({
      where: { email: metadata.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: metadata.email,
          magicIssuer: metadata.issuer!,
          walletAddress: metadata.publicAddress!
        },
      });
    }

    return user;
  } catch (err) {
    return null;
  }
}
