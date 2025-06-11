export interface SetupDetailsType {
    setup_id: number;
    fusion_domain: string;
    fusion_username: string;
    fusion_password: string;
    mail_notification: string;
  }
  
export interface SetupDetailsResponse {
    success: boolean;
    data: SetupDetailsType[];
  }