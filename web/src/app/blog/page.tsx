import { SERVICE_NAME } from '@/constants';
import { IndexPage } from '@/features/blog/components/pages/IndexPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `アレルギー外食ガイド | ${SERVICE_NAME}`,
  description: 'アレルギー外食のヒント・ohgetsuの使い方などを発信します',
};

const Page = () => <IndexPage />;

export default Page;
