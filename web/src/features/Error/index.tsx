import { STATUS_CODES } from '@/constants';
import { ReactNode } from 'react';
import { Error500 } from './500';

type ErrorProps = {
  statusCode: number;
};

const Error = ({ statusCode }: ErrorProps) => {
  switch (statusCode) {
    case STATUS_CODES.INTERNAL_SERVER_ERROR.code:
    default:
      return <Error500 />;
  }
};

type ErrorSafePageProps = {
  error: { message: string; statusCode: number };
  children: ReactNode;
};

// 表示時のデータ取得エラーを処理する専用のコンポーネント
export const ErrorSafePage = ({ error, children }: ErrorSafePageProps) => {
  if (!error) {
    return children;
  }

  const statusCode = error.statusCode;

  return <Error statusCode={statusCode} />;
};
