import { api } from '@/lib/swagger-client';
import { HttpResponse, RestaurantDto } from '@/types/generated/Api';
import { useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UseFormReset } from 'react-hook-form';
import { KeyedMutator } from 'swr';
import { FormValues, PreviewType } from '../index.d';

type TUseHandlerArgs = {
  isEdit: boolean;
  restaurant: RestaurantDto | undefined;
  onClose: () => void;
  reset: UseFormReset<FormValues>;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  mutate: KeyedMutator<HttpResponse<RestaurantDto[], any>>;
};

export const useHandler = ({
  isEdit,
  restaurant,
  onClose,
  reset,
  mutate,
}: TUseHandlerArgs) => {
  const [preview, setPreview] = useState<PreviewType>({});

  const toast = useToast();

  // restaurantが存在する場合、プレビュー画像としてrestaurant.picを表示する
  useEffect(() => {
    if (restaurant && restaurant.pic) {
      setPreview((prev) => ({ ...prev, pic: restaurant.pic }));
    }
  }, [restaurant]);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        if (isEdit && !!restaurant) {
          const { error } = await api.restaurants.restaurantsControllerUpdate(
            restaurant?.id,
            { ...values, pic: values.pic ? values.pic[0] : undefined }
          );

          if (error) throw error;
        } else {
          const { error } = await api.restaurants.restaurantsControllerCreate({
            ...values,
            pic: values.pic ? values.pic[0] : undefined,
          });

          if (error) throw error;
        }

        reset();

        setPreview({ pic: undefined });

        mutate();

        onClose();

        toast({
          title: `レストランを${isEdit ? '編集' : '作成'}しました`,
          status: 'success',
          isClosable: true,
        });
      } catch (error) {
        onClose();

        toast({
          title: `レストランを${isEdit ? '編集' : '作成'}できませんでした`,
          status: 'error',
          isClosable: true,
        });
      }
    },
    [toast, reset, setPreview, isEdit, restaurant]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;

      if (!files) return;

      const name = e.target.name;

      setPreview({ ...preview, [name]: URL.createObjectURL(files[0]) });
    },
    [preview, setPreview]
  );

  return { preview, handleSubmit, handleFileChange };
};

export const useDefaultValues = ({
  restaurant,
}: {
  restaurant: RestaurantDto | undefined;
}): FormValues => {
  const result = useMemo(
    () => ({
      name: restaurant?.name ?? '',
      pic: undefined,
      genreId: restaurant?.genre.id ?? '',
      isOpen: !restaurant?.deletedAt,
    }),
    [restaurant?.name, restaurant?.genre.id, restaurant?.deletedAt]
  );

  return result;
};
