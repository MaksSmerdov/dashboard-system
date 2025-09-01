import axios from 'axios';

interface ErrorResponse {
  msg?: string;
  message?: string;
}

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(err)) {
    const data = err.response?.data;
    return data?.msg || data?.message || err.message || 'Ошибка сервера';
  }
  if (err instanceof Error) return err.message;
  return String(err);
}
