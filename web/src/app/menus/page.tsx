import { Menus } from '@/features/Menus';
import {
  CreateMenusSearchCondition,
  MenusSearchCondition,
} from '@/features/Menus/utils';

const MenusPage = ({
  searchParams,
}: {
  searchParams: MenusSearchCondition;
}) => {
  const searchConditions = CreateMenusSearchCondition(searchParams);

  return <Menus searchConditions={searchConditions} />;
};

export default MenusPage;
