import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

function generatePublicId() {
  return `pr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      email,
      amount,
      tokenAddress,
      tokenSymbol,
      decimals,
      chainId,
      title,
      description,
      expiresAt,
    } = req.body;

    if (!email || !amount || !tokenAddress || !tokenSymbol || !chainId) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        magicIssuer: email,
      },
    });

    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        publicId: generatePublicId(),

        creatorId: user.id,

        amount,
        tokenAddress,
        tokenSymbol,
        decimals: Number(decimals ?? 18),
        chainId: Number(chainId),

        title: title ?? null,
        description: description ?? null,

        status: 'pending',

        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return res.status(200).json({
      success: true,
      paymentRequest,
    });
  } catch (err: any) {
    console.error('create payment request error:', err);

    return res.status(500).json({
      error: 'Internal server error',
      details: err.message,
    });
  }
}
