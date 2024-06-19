import { pagesPath } from '@/lib/$path';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { MenusSearchCondition } from '../Menus/utils';

type TUseHandlerArgs = {
  searchConditions: MenusSearchCondition;
};

export const useHandler = ({ searchConditions }: TUseHandlerArgs) => {
  const router = useRouter();

  const handleBack = useCallback(
    () =>
      router.push(
        pagesPath.menus.$url({ query: { ...searchConditions } }).path
      ),
    [router, searchConditions]
  );

  const handleSearchMenus = useCallback(
    () =>
      router.push(
        pagesPath.restaurants._id(searchConditions.restaurantId).$url().path
      ),
    [router, searchConditions]
  );

  const handleSearchRestaurants = useCallback(() => router.push('/'), [router]);

  return { handleBack, handleSearchMenus, handleSearchRestaurants };
};
