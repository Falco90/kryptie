import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { publicId } = req.query;

    if (!publicId || typeof publicId !== 'string') {
      return res.status(400).json({ error: 'Invalid publicId' });
    }

    const paymentRequest = await prisma.paymentRequest.findUnique({
      where: { publicId },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            walletAddress: true,
          },
        },
        payments: true,
      },
    });

    if (!paymentRequest) {
      return res.status(404).json({ error: 'Payment request not found' });
    }

    return res.status(200).json({
      success: true,
      paymentRequest,
    });
  } catch (err: any) {
    console.error('GET payment request error:', err);

    return res.status(500).json({
      error: 'Internal server error',
      details: err.message,
    });
  }
}
