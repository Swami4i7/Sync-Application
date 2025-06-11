"use server";

import { axiosInstance } from "@/api/axios";
import { decryptBody,generateHMAC, processError } from "@/lib/utils";
import { Users, TableProps } from "@/types/users";
import { cookies } from 'next/headers';

export const fetchUsersData = async ({ limit, offset, primaryKey, searchColumns, searchTerm }: TableProps) => {
  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

    if (!sessionToken) {
      throw new Error("Unauthorized: No session token found");
    }

    const url = "/users"; 
    const method = "GET";
    const queryString = `?limit=${limit}&offset=${offset}&primaryKey=${primaryKey}&searchColumns=${searchColumns}&searchTerm=${searchTerm}`;
    const fullUrl = `${axiosInstance.defaults.baseURL}${url}${queryString}`;
    const { signature, timestamp } = generateHMAC(method, fullUrl);

    const response = await axiosInstance.get(url, {
      params: { limit, offset, primaryKey, searchColumns, searchTerm },
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
    console.log("decryptedBody: ", decryptedBody);
    const userData = JSON.parse(decryptedBody);
    console.log("userData: ", userData);
    if (typeof userData === "string") {
      throw new Error(userData);
    }
    return userData;
  } catch (error) {
    const errorMessage = processError(error);
    throw errorMessage;
  }
};

export const createUser = async (data: string): Promise<Users> => {
  const cookieStore = cookies();
    const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

    if (!sessionToken) {
      throw new Error("Unauthorized: No session token found");
    }
  const url = "/users"; 
  const method = "POST";
  const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
  console.log("Data",data);
  const { signature, timestamp } = generateHMAC(method, fullUrl, data);
  console.log("Signature: ", signature);
  try {
    const response = await axiosInstance.post(url,data,{
      headers:{
        'Authorization': `Bearer ${sessionToken}`,
        "X-HMAC-Signature": signature,
        "X-Timestamp": timestamp.toString(),
      }
    });
    return response.data;
  } catch (error) {
    const errorMessage = processError(error);
    throw errorMessage;
  }
};

export const updateUser = async (data:string, user_id: number): Promise<Users> => {
  const cookieStore = cookies();
    const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

    if (!sessionToken) {
      throw new Error("Unauthorized: No session token found");
    }
  const url = `/users/${user_id}`;
  const method = "PATCH";
  const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
  const { signature, timestamp } = generateHMAC(method, fullUrl, data);
  try {
    const response = await axiosInstance.patch(
      url,
      data,
      {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          "X-HMAC-Signature": signature,
          "X-Timestamp": timestamp.toString(),
        },
      }
    );
    console.log("response: ", response.data);
    return response.data;
  } catch (error) {
    const errorMessage = processError(error);
    throw errorMessage;
  }
};

export const deleteUser = async (
data:string,
user_id: number
): Promise<Users[]> => {
  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

    if (!sessionToken) {
      throw new Error("Unauthorized: No session token found");
    }
    const url = `/users/${user_id}`;
    const method = "DELETE";
    const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
    const { signature, timestamp } = generateHMAC(method, fullUrl, data);
    const response = await axiosInstance.delete(
      url,
      {
        data:data,
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          "X-HMAC-Signature": signature,
          "X-Timestamp": timestamp.toString(),
        }
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = processError(error);
    throw errorMessage;
  }
};