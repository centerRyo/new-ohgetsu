import { getStringParams } from '@/lib/search-util';

export type MenusSearchCondition = Readonly<
  MenusSearchConditionRequired & MenusSearchConditionOptional
>;

type MenusSearchConditionRequired = Readonly<{
  restaurantId: string;
}>;

type MenusSearchConditionOptional = Readonly<
  Partial<{
    excludedIngredientIds: string;
  }>
>;

type TCreateMenusSearchCondition = (params: {
  restaurantId: string;
  excludedIngredientIds?: string;
}) => MenusSearchCondition;

export const CreateMenusSearchCondition: TCreateMenusSearchCondition = (
  params
) => {
  const { restaurantId, excludedIngredientIds } = params;

  const requiredParams: MenusSearchConditionRequired = {
    restaurantId: getStringParams(restaurantId),
  };

  const optionalParams: MenusSearchConditionOptional = {
    excludedIngredientIds: getStringParams(excludedIngredientIds),
  };

  const searchCondition = {
    ...requiredParams,
    ...optionalParams,
  };

  return searchCondition;
};
