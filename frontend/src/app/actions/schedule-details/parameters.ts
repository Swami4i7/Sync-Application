'use server';
import { axiosInstance } from "@/api/axios";
import {  generateHMAC, processError } from "@/lib/utils";
import {  saveParametersType } from "@/types/parameters";
import { cookies } from "next/headers";

export async function getParameters(schedule_id: number) { 
  try{
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

    if (!sessionToken) {
      throw new Error("Unauthorized: No session token found");
    }

    const url = `/schedule-details/parameters/${schedule_id}`;
    const method = "GET";
    const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
    const { signature, timestamp } = generateHMAC(method, fullUrl);

    const response = await axiosInstance.get(url, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'X-HMAC-Signature': signature,
        'X-Timestamp': timestamp.toString(),
      },
    });

    // const response = await axiosInstance.get(`/schedule-details/parameters/${schedule_id}`);
     
  //   console.log("response: para ", response.data);
  //   const parsedData = JSON.parse(response.data);
  //   console.log("parsedData: para ", parsedData);
  //   const { ciphertext, iv } = parsedData;

  //   if (!ciphertext || !iv) {
  //     throw new Error("Missing ciphertext or IV on Fetch");
  //   }
  //   const decryptedBody = decryptBody(ciphertext, iv);
  //   console.log("decryptedBody: ", decryptedBody);
  //   const parametersData = JSON.parse(decryptedBody);
  //   console.log("parametersData: ", parametersData);
  //   if (typeof parametersData === "string") {
  //     throw new Error(parametersData);
  //   }
  // return parametersData;
  return response.data;
}
  catch (error) {
    const errorMessage = processError(error);
    throw new Error(errorMessage);
  }

}

export async function saveParameters(data: string): Promise <saveParametersType> {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

  if (!sessionToken) {
    throw new Error("Unauthorized: No session token found");
  }

  const url = "/schedule-details/updateBulkParameter";
  const method = "POST";
  const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
  const { signature, timestamp } = generateHMAC(method, fullUrl, data);

  try{
    const response = await axiosInstance.post(url, data, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        "X-HMAC-Signature": signature,
        "X-Timestamp": timestamp.toString(),
      },
    });
  
  // console.log("save param data:", JSON.stringify(data));
  //const response = await axiosInstance.post("schedule-details/updateBulkParameter", data);
  console.log("response update/del parameter: ", response.data);
  return response.data;
} catch (error) {
    const errorMessage = processError(error);
    throw new Error(errorMessage);
  }
}