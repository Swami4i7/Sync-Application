"use server";
import { axiosInstance } from "../../../api/axios";
import { AddScheduleFormSchema } from "@/components/pages/schedule-details/AddScheduleForm";
import { AddParameterFormSchema } from "@/components/pages/schedule-details/AddParameterForm";
import { format, isValid } from "date-fns";
import { revalidatePath } from "next/cache";
import { ScheduleDetailsResponse, ScheduleList } from "@/types/scheduleDetails";
import { EditScheduleFormSchema } from "@/components/pages/schedule-details/EditScheduleModal";
import { decryptBody, generateHMAC, processError } from "@/lib/utils";
import { cookies } from "next/headers";
interface getScheduleDetailsProps {
  limit: number;
  offset: number;
  primaryKey: string;
  searchTerm?: string;
  searchColumns?: string;
}

export async function getScheduleDetails({
  limit,
  offset,
  primaryKey,
  searchTerm,
  searchColumns,
}: getScheduleDetailsProps): Promise<ScheduleDetailsResponse> {
  try {

    const cookieStore = cookies();
        const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;
    
        if (!sessionToken) {
          throw new Error("Unauthorized: No session token found");
        }
    const url = "/schedule-details/readscheduler";
    const method = "GET";
    const queryString = `?limit=${limit}&offset=${offset}&primaryKey=${primaryKey}&searchTerm=${searchTerm}&searchColumns=${searchColumns}`;
    const fullUrl = `${axiosInstance.defaults.baseURL}${url}${queryString}`;
    const { signature, timestamp } = generateHMAC(method, fullUrl);

    const schedulerResponse = await axiosInstance.get(url, {
      params: { limit, offset, primaryKey, searchTerm, searchColumns },
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "X-HMAC-Signature": signature,
        "X-Timestamp": timestamp.toString(),
      },
    });
    // const schedulerResponse = await axiosInstance.get(
    //   `/schedule-details/readscheduler?limit=${limit}&offset=${offset}&primaryKey=${primaryKey}&searchTerm=${searchTerm}&searchColumns=${searchColumns}`
    // );

    const parsedSchedulerData = JSON.parse(schedulerResponse.data);
    const { ciphertext, iv } = parsedSchedulerData;
    //console.log("ciphertext 1: ", ciphertext);
    //console.log("iv 1: ", iv);
    if (!ciphertext || !iv) {
      throw new Error("Missing ciphertext or IV on Fetch");
    }

    const decryptedBody = decryptBody(ciphertext, iv);
    const SchedulerData = JSON.parse(decryptedBody);
    if (typeof SchedulerData === "string") {
      throw new Error(SchedulerData);
    }  
    //console.log("SchedulerData: ", SchedulerData);

    const {
      success,
      totalPages,
      pageCount,
      data: scheduleList = [],
    } = SchedulerData || {};    

    // console.log("SAC DATA: ", schedulerResponse.data);
    //const statusResponse = await axiosInstance.get("/custom/status");

    const statusUrl = "/custom/status";
    const statusMethod = "GET";
    const statusQueryString = ``;
    const statusFullUrl = `${axiosInstance.defaults.baseURL}${url}${statusQueryString}`;
    const { signature: statusSignature, timestamp: statusTimestamp } =
      generateHMAC(statusMethod, statusFullUrl);
    const statusResponse = await axiosInstance.get(statusUrl, {
      params: {},
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "X-HMAC-Signature": statusSignature,
        "X-Timestamp": statusTimestamp.toString(),
      },
    });
    //console.log("SAC STATUS", statusResponse.data);

    const parsedStatusData = JSON.parse(statusResponse.data);
    const { ciphertext: statusCiphertext, iv: statusIv } = parsedStatusData;
    //console.log("ciphertext 2: ", statusCiphertext);
    //console.log("iv 2: ", statusIv);
    if (!statusCiphertext || !statusIv) {
    // if (!ciphertext || iv) {
      throw new Error("Missing ciphertext or IV on Fetch");
    } 
    const statusDecryptedBody = decryptBody(statusCiphertext, statusIv);
    const statusData = JSON.parse(statusDecryptedBody);
    if (typeof statusData === "string") {
      throw new Error(statusData);
    }    
    //console.log("StatusData: pre json ", statusDecryptedBody);
    //console.log("StatusData: ", statusData);


    const formatDate = (dateStr: string) => {
      const parsedDate = new Date(dateStr);
      return isValid(parsedDate)
        ? format(parsedDate, "dd-MMM-yyyy hh:mm:ss a")
        : null;
    };

    const statusMap: Record<string, string | null> = {};
    statusData.forEach((item: { id: string; date: string | null }) => {
      statusMap[item.id] = item.date ? formatDate(item.date) : null;
    });

    const mergedSchedules = {
      success,
      totalPages,
      pageCount,
      data: scheduleList.map((schedule: ScheduleList) => ({
        ...schedule,
        DATE: statusMap[schedule.SCHEDULE_ID] ?? null,
      })),
    };

    // console.log("Merged Schedule Data:", mergedSchedules);
    return mergedSchedules;
  } catch (error ) {
    const errorMessage = processError(error);
    return {
      success: false,
      totalPages: 0,
      pageCount: 0,
      data: [],
      error: errorMessage,
    } as ScheduleDetailsResponse;
  }
}

export async function createScheduleParameter(data: string) : Promise<ScheduleList> {
  const cookieStore = cookies();
      const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;
  
      if (!sessionToken) {
        throw new Error("Unauthorized: No session token found");
      }
  console.log("Final Payload:", data);
  //const response = await axiosInstance.post("/schedule-details/scheduleparameter", data);
  const url = "/schedule-details/scheduleparameter";
  const method = "POST";
  const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
  const { signature, timestamp } = generateHMAC(method, fullUrl, data);
  console.log("Signature: ", signature);
  try{
  const response = await axiosInstance.post(url, data, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      "X-HMAC-Signature": signature,
      "X-Timestamp": timestamp.toString(),
    }
  });
  console.log("Response: ", response.data);
  console.log("Create Schedule Parameter Response:", response);
  return response.data;
} catch (error) {
  const errorMessage = processError(error);
  throw errorMessage;
}
}

export async function createScheduleDetails(formData: AddScheduleFormSchema) {
  const response = await axiosInstance.post(
    "/schedule-details/createSchedule",
    formData
  );
  return response.data;
}

// export async function updateScheduleDetails(
//   data: EditScheduleFormSchema,
//   schedule_id: number
// ) {
//   const response = await axiosInstance.put(
//     `/schedule-details/updateschedule/${schedule_id}`,
//     data
//   );
//   if (response.data.schedule_id) revalidatePath("/schedule-details");
//   return response.data;
// }

export const updateScheduleDetails = async  (data: string,
  schedule_id: number): Promise<EditScheduleFormSchema> => {

  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;
  if (!sessionToken) {
    throw new Error("Unauthorized: No session token found");
  }
  console.log("Schedule ID being sent:", schedule_id); // must show value


  const url = `/schedule-details/updateschedule/${schedule_id}`;
  const method = "PUT";
  const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
  const { signature, timestamp } = generateHMAC(method, fullUrl, data);
  console.log("timestamp: ", timestamp);
  try{
    const response = await axiosInstance.put(
      url,
      data,
      {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          "X-HMAC-Signature": signature,
          "X-Timestamp": timestamp.toString(),
        }
      }
    );
    
  // const response = await axiosInstance.put(
  //   `/schedule-details/updateschedule/${schedule_id}`,
  //   data
  // );
  console.log("response sta: ", response.status);
  console.log("Update Schedule Response id:", response.data.schedule_id);
  if (response.status == 200) revalidatePath("/schedule-details");
  return response.data;
} catch (error) {
  const errorMessage = processError(error);
  throw errorMessage;
}

}

export const  deleteScheduleDetails = async (
  data:string,
  id: number) : Promise<ScheduleDetailsResponse[]> => {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;
  if (!sessionToken) {
    throw new Error("Unauthorized: No session token found");
  }
  try{
    const url = `/schedule-details/deleteschedule/${id}`;
    const method = "DELETE";
    const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;
    const { signature, timestamp } = generateHMAC(method, fullUrl, data);
    console.log("timestamp: ", timestamp);
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
    // const response = await axiosInstance.delete(
    //   `/schedule-details/deleteschedule/${id}`
    // );
   
    if (response.data.schedule_id) revalidatePath("/schedule-details");
    return response.data;
  } catch (error) {
    const errorMessage = processError(error);
    throw errorMessage;
  }
 
}

export async function createParameterDetails(
  formattedPayload: AddParameterFormSchema,
  schedule_id: string
) {
  const response = await axiosInstance.post(
    `/updateBulkParameter/${schedule_id}`,
    formattedPayload
  );
  // console.log("Create Parameter Response:", response);

  return response.data;
}

export async function startSchedule() {
  const cookieStore = cookies();
      const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;
  
      if (!sessionToken) {
        throw new Error("Unauthorized: No session token found");
      }
  try {
    const url = "/custom/start";
    const method = "GET";
    const queryString = ``;
    const fullUrl = `${axiosInstance.defaults.baseURL}${url}${queryString}`;
    const { signature, timestamp } = generateHMAC(method, fullUrl);
    const response = await axiosInstance.get(url, {
      params: {},
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        "X-HMAC-Signature": signature,
        "X-Timestamp": timestamp.toString(),
      },
    });
    //const response = await axiosInstance.get("/custom/start");
    if (response.data.status) revalidatePath("/schedule-details");

    return response.data;
  } catch (error: unknown) {
    return error;
  }
}

export async function stopSchedule() {
  const cookieStore = cookies();
      const sessionToken = (await cookieStore).get('next-auth.session-token')?.value;
  
      if (!sessionToken) {
        throw new Error("Unauthorized: No session token found");
      }
  try {
    const url = "/custom/stop";
    const method = "GET";
    const queryString = ``;
    const fullUrl = `${axiosInstance.defaults.baseURL}${url}${queryString}`;
    const { signature, timestamp } = generateHMAC(method, fullUrl);
    const response = await axiosInstance.get(url, {
      params: {},
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        "X-HMAC-Signature": signature,
        "X-Timestamp": timestamp.toString(),
      },
    });
    //const response = await axiosInstance.get("/custom/stop");
    if (response.data.status) revalidatePath("/schedule-details");
    return response.data;
  } catch (error: unknown) {
    return error;
  }
}
