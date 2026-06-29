import type { NextApiRequest } from "next";
import magicAdmin from "@/server/magic";
import { prisma } from "@/server/prisma";

export async function requireUser(req: NextApiRequest) {
  const didToken = extractDidToken(req);

  if (!didToken) {
    throw new Error("Missing Authorization token");
  }

  await magicAdmin.token.validate(didToken);

  const metadata = await magicAdmin.users.getMetadataByToken(didToken);

  if (!metadata.issuer) {
    throw new Error("Invalid Magic user metadata");
  }

  const user = await prisma.user.upsert({
    where: {
      magicIssuer: metadata.issuer,
    },
    update: {
      email: metadata.email ?? undefined,
      walletAddress: metadata.publicAddress ?? undefined,
    },
    create: {
      magicIssuer: metadata.issuer,
      email: metadata.email ?? null,
      walletAddress: metadata.publicAddress ?? null,
    },
  });

  return user;
}

function extractDidToken(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const parts = authHeader.split(" ");

  if (parts.length !== 2) return null;

  const [type, token] = parts;

  if (type !== "Bearer") return null;

  return token;
}
