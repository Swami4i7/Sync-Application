// types/hmac.ts (shared between Next.js and Express)
export interface HMACRequest {
    method: "GET" | "POST" | "PUT" | "DELETE";
    url: string;
    body?: string;
  }
  
  export interface HMACResponse<T> {
    signature: string;
    timestamp: number;
    data: T;
  }
  
  export interface Resource {
    id?: number;
    name: string;
  }