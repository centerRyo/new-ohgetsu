import { pagesPath } from '@/lib/$path';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useMenusNavigation = () => {
  const router = useRouter();

  const handleClickMenuManagement = useCallback(
    (restaurantId: string) => {
      router.push(
        pagesPath.admin.restaurants._id(restaurantId).menus.$url().path
      );
    },
    [router]
  );

  return { handleClickMenuManagement };
};
