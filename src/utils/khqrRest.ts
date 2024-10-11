import axios, { AxiosInstance, AxiosError } from 'axios';
import { Api, TransactionStatus } from 'src/constants/khrq';

// Define response interface
interface TransactionResponse {
  status: string;
  message: string;
}

// Custom error class for transaction-specific errors
export class TransactionCheckError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = 'TransactionCheckError';
  }
}

/**
 * Checks the transaction status using an MD5 hash
 * @param token - The bearer token for authentication
 * @param md5 - The MD5 hash of the transaction
 * @returns A promise that resolves to the transaction status details
 * @throws {TransactionCheckError} When the transaction check fails
 */
export async function checkTransactionByMd5(
  token: string,
  md5: string,
): Promise<TransactionResponse> {
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: Api.URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYTgxZDA0NjUwNjkzNGU4In0sImlhdCI6MTcyODYzNDY0NywiZXhwIjoxNzM2NDEwNjQ3fQ.A9ZklYZKIcp7weQiAxQBtb4fXE0qbBrVKgmyxpwKF_0`,
    },
    timeout: 10000,
  });

  try {
    const response = await axiosInstance.post<TransactionResponse>(
      '/check_transaction_by_md5',
      { md5 },
    );

    const isPaid = response.data.status === 'true'?  TransactionStatus.PAID : TransactionStatus.UNPAID;

    return {
      status: 'success',
      message: isPaid ? TransactionStatus.PAID : TransactionStatus.UNPAID,
    };
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      throw new TransactionCheckError(
        axiosError.response.status,
        `Transaction check failed: ${(axiosError.response.data as any)?.message || 'Unknown error'}`,
        error as Error,
      );
    } else if (axiosError.request) {
      throw new TransactionCheckError(
        408,
        'Transaction check timed out - no response received',
        error as Error,
      );
    } else {
      throw new TransactionCheckError(
        500,
        'Failed to make transaction check request',
        error as Error,
      );
    }
  }
}
