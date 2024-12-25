import { getStringParams } from '@/lib/search-util';

export type RestaurantsSearchCondition =
  Readonly<RestaurantsSearchConditionalOptional>;

type RestaurantsSearchConditionalOptional = Readonly<
  Partial<{ search_query: string }>
>;

type TCreateRestaurantsSearchCondition = (params: {
  search_query?: string;
}) => RestaurantsSearchCondition;

export const CreateRestaurantsSearchCondition: TCreateRestaurantsSearchCondition =
  (params) => {
    const { search_query } = params;

    const optionalParams: RestaurantsSearchConditionalOptional = {
      search_query: getStringParams(search_query),
    };

    const searchCondition = {
      ...optionalParams,
    };

    return searchCondition;
  };
