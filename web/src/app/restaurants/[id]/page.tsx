'use client';

import { Restaurant } from '@/features/Restaurant';

const RestaurantPage = ({ params }: { params: { id: string } }) => (
  <Restaurant restaurantId={params.id} />
);

export default RestaurantPage;
