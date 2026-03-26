import { Menu } from '@/features/Menu';
import {
  CreateMenusSearchCondition,
  MenusSearchCondition,
} from '@/features/Menus/utils';

export type OptionalQuery = MenusSearchCondition;

const MenuPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<MenusSearchCondition>;
}) => {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const searchConditions = CreateMenusSearchCondition(resolvedSearchParams);

  return <Menu menuId={id} searchConditions={searchConditions} />;
};
export default MenuPage;
