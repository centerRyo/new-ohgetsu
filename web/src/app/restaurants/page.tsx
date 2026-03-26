import { Restaurants } from '@/features/Restaurants';
import {
  CreateRestaurantsSearchCondition,
  RestaurantsSearchCondition,
} from '@/features/Restaurants/utils';

export type OptionalQuery = RestaurantsSearchCondition;

const RestaurantsPage = async ({
  searchParams,
}: {
  searchParams: Promise<RestaurantsSearchCondition>;
}) => {
  const resolvedSearchParams = await searchParams;
  const searchConditions = CreateRestaurantsSearchCondition(resolvedSearchParams);

  return <Restaurants searchConditions={searchConditions} />;
};

export default RestaurantsPage;
