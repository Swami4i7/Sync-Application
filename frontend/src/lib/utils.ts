import { isAxiosError } from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
    createSearchParamsCache,
    parseAsInteger,
    parseAsString,
} from 'nuqs/server'
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from "crypto";
import { axiosInstance } from "@/api/axios";
import env from "@/api/env";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processError(error: unknown): string {
  console.log('Error: ', error)
  if (isAxiosError(error)) {
    console.error("Axios error: ", error.response?.data);
    return error.response?.data;
  } else if (error instanceof Error) {
    console.error("Generic error: ", error.message);
    return error.message;
  }
  return "An unknown error occurred.";
}

export const scheduleDetailsProps = {
  limit: parseAsInteger.withDefault(10),
  offset: parseAsInteger.withDefault(0),
  primaryKey: parseAsString.withDefault("schedule_id"),
  searchTerm: parseAsString.withDefault(""),
  searchColumns: parseAsString.withDefault("BI_REPORT_NAME,SCHEDULE_NAME,FREQUENCY_MIN,DB_TABLE_NAME,DB_COLUMN_NAMES,OPERATION,BI_REPORT_PATH"),
};

export const usersProps = {
  limit: parseAsInteger.withDefault(10),
  offset: parseAsInteger.withDefault(0),
  primaryKey: parseAsString.withDefault("user_id"),
  searchTerm: parseAsString.withDefault(""),
  searchColumns: parseAsString.withDefault("user_id,user_name,role"),
};

export const scheduleDetailsPropsCache = createSearchParamsCache(scheduleDetailsProps);
export const usersPropsCache = createSearchParamsCache(usersProps);


export const scheduleLogsProps = {
  limit: parseAsInteger.withDefault(10),
  offset: parseAsInteger.withDefault(0),
  primaryKey: parseAsString.withDefault("CREATION_DATE"),
  searchTerm: parseAsString.withDefault(""),
  searchColumns: parseAsString.withDefault("SCHEDULE_LIST_ID,SCHEDULE_NAME,BI_REPORT_PATH,BI_REPORT_NAME,LAST_REFRESH_TIME,SCHEDULE_STATUS,ERROR_MESSAGE,CREATION_DATE"),
  customWhere: parseAsString.withDefault(""),
};

export const scheduleLogsPropsCache = createSearchParamsCache(scheduleLogsProps);

export const errorLogsProps = {
  limit: parseAsInteger.withDefault(10),
  offset: parseAsInteger.withDefault(0),
  primaryKey: parseAsString.withDefault("schedule_list_id"),
  searchTerm: parseAsString.withDefault(""),
  searchColumns: parseAsString.withDefault("SCHEDULE_LIST_ID,TABLE_NAME,MERGE_QUERY,ERR_MSG,ERR_STATUS"),
  customWhere: parseAsString.withDefault(""),
};

export const errorLogsPropsCache = createSearchParamsCache(errorLogsProps);

export function generateHMAC(method: string, url: string, body: string = ""): { signature: string; timestamp: number } {
  const SECRET_KEY: string | undefined = env.NEXT_PUBLIC_HMAC_SECRET;
  const timestamp: number = Date.now();
  const baseUrlWithoutApi = axiosInstance.defaults.baseURL?.replace('/api/sync', '') ?? '';
  const relativeUrl: string = url.replace(baseUrlWithoutApi, "");
  const data: string = `${timestamp}${method.toUpperCase()}${relativeUrl}${body}`;
  if (!SECRET_KEY) {
    throw new Error("HMAC_SECRET is not defined in environment variables");
  }
  const signature: string = createHmac("sha256", SECRET_KEY)
    .update(data)
    .digest("hex");
  return { signature, timestamp };
}

export function encryptBody(data: string): { ciphertext: string; iv: string } {
  const HMAC_SECRET: string = env.NEXT_PUBLIC_HMAC_SECRET || "";
  const PUBLIC_KEY_VALUE: string = env.NEXT_PUBLIC_KEY || "";
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

export function decryptBody(ciphertext: string, iv: string): string {
    const HMAC_SECRET: string = env.NEXT_PUBLIC_HMAC_SECRET || "";
    const PUBLIC_KEY_VALUE: string = env.NEXT_PUBLIC_KEY || "";
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
}

