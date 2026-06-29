import { Magic } from "@magic-sdk/admin";
if (!process.env.MAGIC_SECRET_KEY) {
  throw new Error("Missing MAGIC_SECRET_KEY in environment variables");
}

const magicAdmin = new Magic(process.env.MAGIC_SECRET_KEY);

export default magicAdmin;
