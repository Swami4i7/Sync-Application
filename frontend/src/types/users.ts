export type Users = {
	USER_ID: number;
	USER_NAME: string;
	PASSWORD: string;
	ROLE: string;
	CREATED_BY: string;
	CREATION_DATE: Date | undefined;
	LAST_UPDATED_BY: string;
	LAST_UPDATE_DATE: Date | undefined;
};

export interface TableProps {
	limit: number;
	offset: number;
	primaryKey: string;
	searchColumns?: string;
	searchTerm?: string;
	customWhere?: string;
  }

export type UsersPayload = {
	user_id: string;
};

export type UserCreate={
	user_name: string;
	password: string;
	role: string;
	created_by: string;
}
export type UsersUpdate = {
	user_name: string;
	password: string;
	role: string;
	created_by: string;
	last_updated_by: string;
};

export type UsersDelete = {
	user_id: string;
};

export type loginUser = {
	user_name: string;
	password: string;
	role:string;
};

export interface LookupValue {
    lookup_value_id: number;
    lookup_value_code: string;
    lookup_value_name: {
      [key: string]: string;
    };
  }
  