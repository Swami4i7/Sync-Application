export interface ApiResponse {
  success: boolean;
  data?: any;
  pageCount?: number;
  totalPages?: number;
  message?: string;
}


export interface SearchParams {
  searchColumns?: string[];
  searchTerm?: string;
  sortColumn?: string;
  sortOrder?: "ASC" | "DESC";
  limit?: number;
  offset?: number;
  primaryKey?: string;
  customWhere?: Record<string, { operator: string; value: any }>;
}
