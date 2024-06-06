import { Api } from '@/types/generated/Api';

export const api = new Api({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
});
