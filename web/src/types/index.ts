export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LinksList {
  links: Link[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateLinkData {
  originalUrl: string;
  shortUrl?: string;
}

export interface CsvReport {
  fileName: string;
  publicUrl: string;
  fileSize: number;
  createdAt: string;
}

export interface CreateLinkFormData {
  originalUrl: string;
  shortUrl: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}
