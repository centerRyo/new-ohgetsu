'use client';

import { Restaurants } from '@/features/Restaurants';
import {
  CreateRestaurantsSearchCondition,
  RestaurantsSearchCondition,
} from '@/features/Restaurants/utils';

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
