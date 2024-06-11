import { Menus } from '@/features/Menus';
import {
  CreateMenusSearchCondition,
  MenusSearchCondition,
} from '@/features/Menus/utils';

export type OptionalQuery = MenusSearchCondition;

const MenusPage = ({
  searchParams,
}: {
  searchParams: MenusSearchCondition;
}) => {
  const searchConditions = CreateMenusSearchCondition(searchParams);

  return <Menus searchConditions={searchConditions} />;
};

export default MenusPage;
