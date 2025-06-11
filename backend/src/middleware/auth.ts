import { Request, Response, NextFunction } from 'express';
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from "crypto";
import { Resource } from "../types/hmac";
import { JWT } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';  // Add this import
const SECRET_KEY: string = process.env.HMAC_SECRET || "";

if (!SECRET_KEY) {
  throw new Error("HMAC_SECRET is not defined");
}
export function verifyHMAC(req: Request, res: Response, next: NextFunction): void {
  const { method, originalUrl } = req;
  const body: string = method === "GET" ? "" : req.body ? JSON.stringify(req.body) : "";
  console.log("HMAC Data (Backend):", { body });
  const clientSignature: string = req.headers["x-hmac-signature"] as string;
  const timestamp: number = parseInt(req.headers["x-timestamp"] as string, 10);

  if (!clientSignature || isNaN(timestamp)) {
    res.status(403).json({ error: "Missing HMAC signature or timestamp" });
    return;
  }

  const timeDiff: number = Date.now() - timestamp;
  if (timeDiff > 5 * 60 * 1000) {
    res.status(403).json({ error: "Request timestamp too old" });
    return;
  }
  const decodedUrl = decodeURIComponent(originalUrl);

  let adjustedUrl: string = decodedUrl;

  
  const data: string = `${timestamp}${method.toUpperCase()}${adjustedUrl}${body}`;

  const serverSignature: string = createHmac("sha256", SECRET_KEY)
    .update(data)
    .digest("hex");

  if (serverSignature !== clientSignature) {
    console.log("Signature Mismatch:", { clientSignature, serverSignature });
    res.status(403).json({ error: "Invalid HMAC signature" });
    return;
  }

  res.locals.hmacSignature = clientSignature;
  res.locals.timestamp = timestamp;

  next();
}

export function decryptBody(ciphertext: string, iv: string): string {
  try {
    const HMAC_SECRET: string = process.env.HMAC_SECRET || "";
    const PUBLIC_KEY_VALUE: string = process.env.PUBLIC_KEY || "";
    if (!HMAC_SECRET || !PUBLIC_KEY_VALUE) {
      throw new Error("HMAC_SECRET or PUBLIC_KEY_VALUE is not defined");
    }

    const AES_KEY: Buffer = createHash("sha256")
      .update(HMAC_SECRET + PUBLIC_KEY_VALUE)
      .digest();
    const decipher = createDecipheriv("aes-256-cbc", AES_KEY, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(ciphertext, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    throw new Error("Decryption failed");
  }
}

export function encryptBody(data: string): { ciphertext: string; iv: string } {
  const HMAC_SECRET: string = process.env.HMAC_SECRET || "";
  const PUBLIC_KEY_VALUE: string = process.env.PUBLIC_KEY || "";
  if (!HMAC_SECRET || !PUBLIC_KEY_VALUE) {
    throw new Error("HMAC_SECRET or PUBLIC_KEY_VALUE is not defined");
  }
  const AES_KEY: Buffer = createHash("sha256")
  .update(HMAC_SECRET + PUBLIC_KEY_VALUE)
  .digest();

  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", AES_KEY, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    ciphertext: encrypted,
    iv: iv.toString("hex"),
  };
}


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No Bearer token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Extracted token:', token);

  try {
    res.locals.sessionToken = token;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
