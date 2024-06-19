import { pagesPath } from '@/lib/$path';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

type TUseHandlerArgs = {
  restaurantId: string;
};

export const useHandler = ({ restaurantId }: TUseHandlerArgs) => {
  const router = useRouter();

  const handleBack = useCallback(
    () => router.push(pagesPath.restaurants._id(restaurantId).$url().path),
    [router, restaurantId]
  );

  return { handleBack };
};
