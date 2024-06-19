import { pagesPath } from '@/lib/$path';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { UseFormGetValues } from 'react-hook-form';
import { FormValues } from './index.d';

type TUseHandlerArgs = {
  getValues: UseFormGetValues<FormValues>;
  restaurantId: string;
};

export const useHandler = ({ getValues, restaurantId }: TUseHandlerArgs) => {
  const router = useRouter();

  const handleBack = useCallback(() => router.push('/'), [router]);

  const handleClickSearch = useCallback(() => {
    const values = getValues();

    const excludedIngredientIds = values.ingredients
      ? values.ingredients.join(',')
      : '';

    router.push(
      pagesPath.menus.$url({
        query: { restaurantId, excludedIngredientIds },
      }).path
    );
  }, [getValues, router, restaurantId]);

  return { handleClickSearch, handleBack };
};
