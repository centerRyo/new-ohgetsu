import { SERVICE_NAME } from '@/components/constants';
import { Metadata } from 'next';
import ShopsPage from './shops/page';

export const metadata: Metadata = {
  title: SERVICE_NAME,
  description: '自分が食べれるメニューがきっと見つかる、アレルギー検索サイト',
  keywords: 'アレルギー,レストラン',
};

const App = ShopsPage;

export default App;
