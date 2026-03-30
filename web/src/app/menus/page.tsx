import { Menus } from '@/features/Menus';
import {
  CreateMenusSearchCondition,
  MenusSearchCondition,
} from '@/features/Menus/utils';

export type OptionalQuery = MenusSearchCondition;

const MenusPage = async ({
  searchParams,
}: {
  searchParams: Promise<MenusSearchCondition>;
}) => {
  const resolvedSearchParams = await searchParams;
  const searchConditions = CreateMenusSearchCondition(resolvedSearchParams);

  return <Menus searchConditions={searchConditions} />;
};

export default MenusPage;
