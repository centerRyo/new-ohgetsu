'use client';

import { Menu } from '@/features/Menu';
import {
  CreateMenusSearchCondition,
  MenusSearchCondition,
} from '@/features/Menus/utils';

export type OptionalQuery = MenusSearchCondition;

const MenuPage = ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: MenusSearchCondition;
}) => {
  const searchConditions = CreateMenusSearchCondition(searchParams);

  return <Menu menuId={params.id} searchConditions={searchConditions} />;
};
export default MenuPage;
