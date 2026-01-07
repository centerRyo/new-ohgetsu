import { SERVICE_NAME } from '@/constants';
import { IndexPage } from '@/features/blog/components/pages/IndexPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `アレルギー外食ガイド | ${SERVICE_NAME}`,
  description: 'アレルギー外食のヒント・ohgetsuの使い方などを発信します',

  alternates: {
    canonical: 'https://ohgetsu.com/blog',
  },

  openGraph: {
    title: `アレルギー外食ガイド | ${SERVICE_NAME}`,
    description: 'アレルギー外食のヒント・ohgetsuの使い方などを発信します',
    url: 'https://ohgetsu.com/blog',
    siteName: SERVICE_NAME,
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: `アレルギー外食ガイド | ${SERVICE_NAME}`,
    description: 'アレルギー外食のヒント・ohgetsuの使い方などを発信します',
  },

  robots: {
    index: true,
    follow: true,
  },
};

const Page = () => <IndexPage />;

export default Page;
