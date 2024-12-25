'use client';

import {
  CreateRestaurantsSearchCondition,
  RestaurantsSearchCondition,
} from '@/features/CreateMenus/Restaurants/utils';
import { Restaurants } from '@/features/Restaurants';

export type OptionalQuery = RestaurantsSearchCondition;

const RestaurantsPage = ({
  searchParams,
}: {
  searchParams: RestaurantsSearchCondition;
}) => {
  const searchConditions = CreateRestaurantsSearchCondition(searchParams);

  return <Restaurants searchConditions={searchConditions} />;
};

export default RestaurantsPage;
