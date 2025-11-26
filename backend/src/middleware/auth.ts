import { Request, Response, NextFunction } from 'express';
import sodium from "libsodium-wrappers"; 
const SECRET_KEY: string = process.env.HMAC_SECRET || "";

if (!SECRET_KEY) {
  throw new Error("HMAC_SECRET is not defined");
}

// Global ready state
let sodiumReady = false;

sodium.ready
  .then(() => {
    sodiumReady = true;
    console.log("libsodium initialized successfully");
  })
  .catch((err) => {
    console.error("FATAL: libsodium failed to load:", err);
    process.exit(1);
  });

async function getSodium() {
  if (!sodiumReady) {
    await sodium.ready;   
  }
  return sodium;
}

export async function verifyHMAC(req: Request, res: Response, next: NextFunction): Promise<void> {
  const s = await getSodium();
  const { method, originalUrl } = req;
  console.log("HMAC Data (Backend):", { method, originalUrl });
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

  let adjustedUrl: string = originalUrl;

  const data: string = `${timestamp}${method.toUpperCase()}${adjustedUrl}${body}`;
  console.log("HMAC Data (Backend):", { timestamp, method, url: adjustedUrl, body, data });

  const serverSignatureBytes = s.crypto_auth(
    s.from_string(data),
    s.from_string(SECRET_KEY)
  );
  const serverSignature: string = s.to_hex(serverSignatureBytes);

  if (serverSignature !== clientSignature) {
    console.log("Signature Mismatch:", { clientSignature, serverSignature });
    res.status(403).json({ error: "Invalid HMAC signature" });
    return;
  }

  res.locals.hmacSignature = clientSignature;
  res.locals.timestamp = timestamp;

  next();
}

export async function decryptBody(ciphertext: string, iv: string): Promise<string> {
  try {
    const s = await getSodium();
    const HMAC_SECRET: string = process.env.HMAC_SECRET || "";
    const PUBLIC_KEY_VALUE: string = process.env.PUBLIC_KEY || "";
    if (!HMAC_SECRET || !PUBLIC_KEY_VALUE) {
      throw new Error("HMAC_SECRET or PUBLIC_KEY_VALUE is not defined");
    }
    const keyInput = s.from_string(HMAC_SECRET + PUBLIC_KEY_VALUE);
    const AES_KEY = s.crypto_generichash(32, keyInput);

    const ivBytes = s.from_hex(iv);
    const cipherBytes = s.from_hex(ciphertext);

    const decryptedBytes = s.crypto_secretbox_open_easy(cipherBytes, ivBytes, AES_KEY);
    if (decryptedBytes === null) {
      throw new Error("Decryption failed");
    }
    return s.to_string(decryptedBytes);
  } catch (error) {
    throw new Error("Decryption failed");
  }
}

export async function encryptBody(data: string): Promise<{ ciphertext: string; iv: string }> {
  const s = await getSodium();
  const HMAC_SECRET: string = process.env.HMAC_SECRET || "";
  const PUBLIC_KEY_VALUE: string = process.env.PUBLIC_KEY || "";
  if (!HMAC_SECRET || !PUBLIC_KEY_VALUE) {
    throw new Error("HMAC_SECRET or PUBLIC_KEY_VALUE is not defined");
  }

  // ← Same key derivation as before
  const keyInput = s.from_string(HMAC_SECRET + PUBLIC_KEY_VALUE); 
  const AES_KEY = s.crypto_generichash(32, keyInput);

  const iv = s.randombytes_buf(s.crypto_secretbox_NONCEBYTES); 
  const message = s.from_string(data);
  const ciphertext = s.crypto_secretbox_easy(message, iv, AES_KEY);

  return {
    ciphertext: s.to_hex(ciphertext),
    iv: s.to_hex(iv),
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