import { Menus } from '@/features/Menus';
import { CreateMenusSearchCondition } from '@/features/Menus/utils';

const MenusPage = ({
  searchParams,
}: {
  searchParams: { shopId: string; excludedIngredientIds?: string };
}) => {
  const searchConditions = CreateMenusSearchCondition(searchParams);

  return <Menus searchConditions={searchConditions} />;
};

export default MenusPage;
