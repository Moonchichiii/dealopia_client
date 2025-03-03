// Re-export all types
export * from './auth';
export * from './deals';
export * from './shops';
export * from './categories';
export * from './locations';

// Common API response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  code?: string;
  [key: string]: any;
}