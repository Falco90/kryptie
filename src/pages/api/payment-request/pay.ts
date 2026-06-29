import { withAuth } from '@/server/withAuth';
import { prisma } from '@/lib/prisma';

export default withAuth(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = (req as any).user;

  const { publicId, txHash } = req.body;

  const request = await prisma.paymentRequest.findUnique({
    where: { publicId },
  });

  if (!request) {
    return res.status(404).json({ error: 'Not found' });
  }

  const payment = await prisma.payment.create({
    data: {
      paymentRequestId: request.id,
      payerAddress: user.walletAddress,
      txHash,
      amount: request.amount,
      chainId: request.chainId,
    },
  });

  await prisma.paymentRequest.update({
    where: { id: request.id },
    data: { status: 'paid' },
  });

  return res.json({ success: true, payment });
});
