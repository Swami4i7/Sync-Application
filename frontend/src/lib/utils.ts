import { isAxiosError } from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
    createSearchParamsCache,
    parseAsInteger,
    parseAsString,
} from 'nuqs/server'
import * as libsodium from "libsodium-wrappers";
import { axiosInstance } from "@/api/axios";
import env from "@/api/env";

let sodiumInstance: typeof libsodium | null = null;

async function getSodiumInstance(): Promise<typeof libsodium> {
  if (!sodiumInstance) {
    await libsodium.ready;
    sodiumInstance = libsodium;
  }
  return sodiumInstance;
}

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

export async function generateHMAC(method: string, url: string, body: string = ""): Promise<{ signature: string; timestamp: number }> {
  const sodium = await getSodiumInstance();
  const SECRET_KEY: string | undefined = env.NEXT_PUBLIC_HMAC_SECRET;
  const timestamp: number = Date.now();
  const baseUrlWithoutApi = axiosInstance.defaults.baseURL?.replace('/api/sync', '') ?? '';
  const relativeUrl: string = url.replace(baseUrlWithoutApi, "");
  const data: string = `${timestamp}${method.toUpperCase()}${relativeUrl}${body}`;
  if (!SECRET_KEY) {
    throw new Error("HMAC_SECRET is not defined in environment variables");
  }
  const keyBytes = sodium.from_string(SECRET_KEY);
  const dataBytes = sodium.from_string(data);
  const signatureBytes = sodium.crypto_auth(dataBytes, keyBytes);
  const signature: string = sodium.to_hex(signatureBytes);
  return { signature, timestamp };
}

export async function encryptBody(data: string): Promise<{ ciphertext: string; iv: string }> {
  const sodium = await getSodiumInstance();
  const HMAC_SECRET: string = env.NEXT_PUBLIC_HMAC_SECRET || "";
  const PUBLIC_KEY_VALUE: string = env.NEXT_PUBLIC_KEY || "";
  if (!HMAC_SECRET || !PUBLIC_KEY_VALUE) {
    throw new Error("HMAC_SECRET or PUBLIC_KEY_VALUE is not defined");
  }
  const keyInput = sodium.from_string(HMAC_SECRET + PUBLIC_KEY_VALUE);
  const AES_KEY = sodium.crypto_generichash(32, keyInput);

  const iv = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const message = sodium.from_string(data);
  const ciphertext = sodium.crypto_secretbox_easy(message, iv, AES_KEY);
  return {
    ciphertext: sodium.to_hex(ciphertext),
    iv: sodium.to_hex(iv),
  };
}

export async function decryptBody(ciphertext: string, iv: string): Promise<string> {
    const sodium = await getSodiumInstance();
    const HMAC_SECRET: string = env.NEXT_PUBLIC_HMAC_SECRET || "";
    const PUBLIC_KEY_VALUE: string = env.NEXT_PUBLIC_KEY || "";
    if (!HMAC_SECRET || !PUBLIC_KEY_VALUE) {
      throw new Error("HMAC_SECRET or PUBLIC_KEY_VALUE is not defined");
    }

    const keyInput = sodium.from_string(HMAC_SECRET + PUBLIC_KEY_VALUE);
    const AES_KEY = sodium.crypto_generichash(32, keyInput);
    const ivBytes = sodium.from_hex(iv);
    const cipherBytes = sodium.from_hex(ciphertext);
    const decrypted = sodium.crypto_secretbox_open_easy(cipherBytes, ivBytes, AES_KEY);
    if (decrypted === null) {
      throw new Error("Decryption failed");
    }
    return sodium.to_string(decrypted);
}