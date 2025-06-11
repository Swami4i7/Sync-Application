"use server";

import { axiosInstance } from "@/api/axios";
import { decryptBody, generateHMAC, processError } from "@/lib/utils";
import { TableProps } from "@/types/users";
import { cookies } from "next/headers";



export const getScheduleNames = async () => {
    try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

    if (!sessionToken) {
      throw new Error("Unauthorized: No session token found");
    }

    const url = "/schedule-logs/readschedulename"; 
    const method = "GET";
    const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
    const { signature, timestamp } = generateHMAC(method, fullUrl);

    const response = await axiosInstance.get(url, {
      params: { },
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        "X-HMAC-Signature": signature,
        "X-Timestamp": timestamp.toString(),
      },
    });    

    const parsedData = JSON.parse(response.data);
    const { ciphertext, iv } = parsedData;

    if (!ciphertext || !iv) {
      throw new Error("Missing ciphertext or IV on Fetch");
    }
    const decryptedBody = decryptBody(ciphertext, iv);
    const data = JSON.parse(decryptedBody);
    if (typeof data === "string") {
      throw new Error(data);
    }
    return data;
  } catch (error) {
    const errorMessage = processError(error);
    throw errorMessage;
  }
};



export async function getScheduleLogs({
  limit,
  offset,
  primaryKey,
  searchColumns,
  searchTerm,
  customWhere,
}: TableProps) {
  
  try {
      const cookieStore = cookies();
      const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

    if (!sessionToken) {
      throw new Error("Unauthorized: No session token found");
    }

  const url = "/schedule-logs/readlist"; 
  const method = "GET";
  const queryString = `?limit=${limit}&offset=${offset}&primaryKey=${primaryKey}&searchColumns=${searchColumns}&searchTerm=${searchTerm}&customWhere=${customWhere}`;
  const fullUrl = `${axiosInstance.defaults.baseURL}${url}${queryString}`;
  const { signature, timestamp } = generateHMAC(method, fullUrl);
    const response = await axiosInstance.get(url, {
          params: { limit, offset, primaryKey, searchColumns, searchTerm, customWhere },
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
            "X-HMAC-Signature": signature,
            "X-Timestamp": timestamp.toString(),
          },
        });
        
        const parsedData = JSON.parse(response.data);
        const { ciphertext, iv } = parsedData;
        
        if (!ciphertext || !iv) {
          throw new Error("Missing ciphertext or IV on Fetch");
        }
        const decryptedBody = decryptBody(ciphertext, iv);
        const syncData = JSON.parse(decryptedBody);
        if (typeof syncData === "string") {
          throw new Error(syncData);
        }
        return syncData;
      } catch (error) {
        const errorMessage = processError(error);
        throw errorMessage;
      }
    };


export async function getErrorLogs({
  limit,
  offset,
  primaryKey,
  searchTerm,
  searchColumns,
  customWhere,
}: TableProps) {
  
  try {

    const cookieStore = cookies();
      const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

    if (!sessionToken) {
      throw new Error("Unauthorized: No session token found");
    }

  const url = "/schedule-logs/getErrorLogs"; 
  const method = "GET";
  const queryString = `?limit=${limit}&offset=${offset}&primaryKey=${primaryKey}&searchColumns=${searchColumns}&searchTerm=${searchTerm}&customWhere=${customWhere}`;
  const fullUrl = `${axiosInstance.defaults.baseURL}${url}${queryString}`;
  console.log("Query String: ", queryString);
  console.log("Full URL: ", fullUrl);
  const { signature, timestamp } = generateHMAC(method, fullUrl);

    const response = await axiosInstance.get(url, {
      params: {
        limit,
        offset,
        primaryKey,
        searchColumns,
        searchTerm,
        customWhere,
      },
      headers: {
            'Authorization': `Bearer ${sessionToken}`,
            "X-HMAC-Signature": signature,
            "X-Timestamp": timestamp.toString(),
          },
    });
        const parsedData = JSON.parse(response.data);
        const { ciphertext, iv } = parsedData;
        
        if (!ciphertext || !iv) {
          throw new Error("Missing ciphertext or IV on Fetch");
        }
        const decryptedBody = decryptBody(ciphertext, iv);
        const errorData = JSON.parse(decryptedBody);
        console.log("Error Data: ", errorData);
        if (typeof errorData === "string") {
          throw new Error(errorData);
        }
        return errorData;
      } catch (error) {
        const errorMessage = processError(error);
        throw errorMessage;
      }
    };

export const clearErrorLogs = async (no_of_weeks: string) => {
  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;
    
    if (!sessionToken) {
      throw new Error("Unauthorized: No session token found");
    }
    const response = await axiosInstance.delete(
      `/schedule-logs/deletelog/${no_of_weeks}`
    );
    console.log("Clear Error Logs:", response.data);
    return response.data;
  } catch (error) {
    const errorMessage = processError(error);
    return errorMessage;
  }
};

