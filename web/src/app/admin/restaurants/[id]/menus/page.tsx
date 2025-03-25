'use client';

import { MenusAdmin } from '@/features/Admin/Menus';

type Props = {
  params: {
    id: string;
  };
};

const MenusAdminPage = ({ params }: Props): JSX.Element => {
  const { id } = params;

  return <MenusAdmin restaurantId={id} />;
};

export default MenusAdminPage;
