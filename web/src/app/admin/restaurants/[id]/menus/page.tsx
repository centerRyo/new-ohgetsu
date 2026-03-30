import { MenusAdmin } from '@/features/Admin/Menus';

const MenusAdminPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <MenusAdmin restaurantId={id} />;
};

export default MenusAdminPage;
