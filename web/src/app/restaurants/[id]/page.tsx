import { Restaurant } from '@/features/Restaurant';

const RestaurantPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <Restaurant restaurantId={id} />;
};

export default RestaurantPage;
