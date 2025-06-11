"use server"
import { axiosInstance } from "@/api/axios";
import { generateHMAC, processError } from "@/lib/utils";

export const userLogin = async (loginData: string)=> {
    try {
      const url = "/login"; 
      const method = "POST";
      const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
      const { signature, timestamp } = generateHMAC(method, fullUrl, loginData);
      const response = await axiosInstance.post(url,loginData,{
        headers: {
          "X-HMAC-Signature": signature,
          "X-Timestamp": timestamp.toString(),
        },
      });
      return response;
    } catch (error) {
      const errorMessage = processError(error);
      throw errorMessage;
    }
};
