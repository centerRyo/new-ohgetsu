import { SERVICE_NAME } from '@/constants';
import { Metadata } from 'next';
import RestaurantsPage from './restaurants/page';

export const metadata: Metadata = {
  title: SERVICE_NAME,
  description: '自分が食べれるメニューがきっと見つかる、アレルギー検索サイト',
  keywords: 'アレルギー,レストラン',
};

const App = RestaurantsPage;

export default App;
