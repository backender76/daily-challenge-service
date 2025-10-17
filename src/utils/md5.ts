import crypto from "node:crypto";

export function md5(bytes: string): string {
  return crypto.createHash("md5").update(bytes).digest("hex");
}
