'use client';

import Shop from '@/features/Shop';

const ShopPage = ({ params }: { params: { id: string } }) => (
  <Shop shopId={params.id} />
);

export default ShopPage;
