/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  code?: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;