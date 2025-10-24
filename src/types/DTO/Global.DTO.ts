/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ErrorResponseDTO {
  message?: string;
  status?: number;
  error?: string;
  success?: boolean;
  code?: string;
}

export interface SuccessResponseDTO {
  message: string;
  status: number;
  data?: any;
  success?: boolean;
}

export type ApiResponse = SuccessResponseDTO | ErrorResponseDTO;