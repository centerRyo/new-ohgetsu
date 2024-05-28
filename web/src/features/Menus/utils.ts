import { getStringParams } from '@/lib/search-util';

export type MenusSearchCondition = Readonly<
  MenusSearchConditionRequired & MenusSearchConditionOptional
>;

type MenusSearchConditionRequired = Readonly<{
  shopId: string;
}>;

type MenusSearchConditionOptional = Readonly<
  Partial<{
    excludedIngredientIds: string;
  }>
>;

type TCreateMenusSearchCondition = (params: {
  shopId: string;
  excludedIngredientIds?: string;
}) => MenusSearchCondition;

export const CreateMenusSearchCondition: TCreateMenusSearchCondition = (
  params
) => {
  const { shopId, excludedIngredientIds } = params;

  const requiredParams: MenusSearchConditionRequired = {
    shopId: getStringParams(shopId),
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
