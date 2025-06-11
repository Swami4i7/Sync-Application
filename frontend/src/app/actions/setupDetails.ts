"use server"

import { axiosInstance } from "@/api/axios";
import { decryptBody,  generateHMAC, processError } from "@/lib/utils";
import { SetupDetailsResponse, SetupDetailsType } from "@/types/setupDetails";
import { cookies } from "next/headers";

// export const getSetupDetails = async (id:number):Promise<SetupDetailsType> => {
//   try{
//     const response = await axiosInstance.get(`/setup-details/${id}`)
//     // console.log("getdetails actions",response.data)
//     return response.data;   
//   } catch (error) {
//     const errorMessage = processError(error);
//     throw new Error(errorMessage);
//   }
 
// }

export const getSetupDetails = async (id: number): Promise<SetupDetailsType> => {
  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

    if (!sessionToken) {
      throw new Error("Unauthorized: No session token found");
    }

    const url = `/setup-details/${id}`;
    const method = "GET";
    const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
    const { signature, timestamp } = generateHMAC(method, fullUrl);
    //console.log("fullurl:", fullUrl);

    const response = await axiosInstance.get(url, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'X-HMAC-Signature': signature,
        'X-Timestamp': timestamp.toString(),
      },
    });

    //console.log("response.data:", response.data, "type:", typeof response.data);

    let parsedData = response.data;
    if (typeof response.data === 'string') {
      try {
        parsedData = JSON.parse(response.data);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid JSON response from server");
      }
    }

    //console.log("parsedData:", parsedData);

    if (parsedData.success === false) {
      throw new Error(parsedData.message || "Failed to fetch setup details");
    }

    if (!parsedData.ciphertext || !parsedData.iv) {
      throw new Error("Missing ciphertext or IV in response");
    }

    const { ciphertext, iv } = parsedData;
    const decryptedBody = decryptBody(ciphertext, iv);
    //console.log("decryptedBody:", decryptedBody);

    let setupDetails;
    try {
      setupDetails = JSON.parse(decryptedBody);
    } catch (parseError) {
      console.error("Decrypted body parse error:", parseError);
      throw new Error("Failed to parse decrypted response");
    }

    //console.log("setupDetails:", setupDetails.rows);

    if (typeof setupDetails === "string") {
      throw new Error(setupDetails);
    }

    return setupDetails.rows;
  } catch (error) {
    const errorMessage = processError(error);
    const message = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
    //console.error("getSetupDetails error:", { originalError: error, processedError: errorMessage });
    throw new Error(message);
  }
};

// export const createSetupDetails = async (data: SetupDetailsType) => {
//   try{
//     console.log("server ac: ", data);
//     const response = await axiosInstance.post(`/setup-details/`, data);
//     console.log("createdetails",response.data)
//     return response.data;
//   } catch (error) {
//     const errorMessage = processError(error);
//     throw new Error(errorMessage);
//   }
// }

export const createSetupDetails = async (data: string): Promise<SetupDetailsType> => {
  
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

    if (!sessionToken) {
      throw new Error("Unauthorized: No session token found");
    }

    const url = "/setup-details";
    const method = "POST";
    const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
    console.log("Data", data);
    const { signature, timestamp } = generateHMAC(method, fullUrl, data);
    console.log("Signature: ", signature);
    try {
    const response = await axiosInstance.post(url, data, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        "X-HMAC-Signature": signature,
        "X-Timestamp": timestamp.toString(),
        
      }
    });
    console.log("createdetails", response.data);
    return response.data;
  } catch (error) {
    const errorMessage = processError(error);
    throw new Error(errorMessage);
  }
};

// export const updateSetupDetails = async (data: SetupDetailsType) => {
//   try{
//     const response = await axiosInstance.patch(`/setup-details/${data.setup_id}`, data);
//     console.log("updatedetails",response.data)
//     return response.data;
//   } catch (error) {
//     const errorMessage = processError(error);
//     throw new Error(errorMessage);
//   }
// }

export const updateSetupDetails = async (data: string, setup_id: number): Promise<SetupDetailsResponse> => {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;

  if (!sessionToken) {
    throw new Error("Unauthorized: No session token found");
  }

  const url = `/setup-details/${setup_id}`;
  const method = "PATCH";
  const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
  const { signature, timestamp } = generateHMAC(method, fullUrl, data); 
  //console.log("data server action: ", data);
  try {
    const response = await axiosInstance.patch(
      url, data, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        "X-HMAC-Signature": signature,
        "X-Timestamp": timestamp.toString(),
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = processError(error);
    throw new Error(errorMessage);
  }
};


export const getScheduleNames = async () => {
  try {
    const response = await axiosInstance.get(`/scheduler/readschedulename`);
    console.log("Schedulsse Names:", response.data);
    return response.data;
  } catch (error) {
    const errorMessage = processError(error);
    return errorMessage;
  }
};