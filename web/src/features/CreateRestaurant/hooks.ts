import { api } from '@/lib/swagger-client';
import { useToast } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { UseFormReset } from 'react-hook-form';
import { FormValues, PreviewType } from './index.d';

type TUseHandlerArgs = {
  preview: PreviewType;
  setPreview: (preview: PreviewType) => void;
  reset: UseFormReset<FormValues>;
};

export const useHandler = ({ preview, setPreview, reset }: TUseHandlerArgs) => {
  const toast = useToast();

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const { data, error } =
          await api.restaurants.restaurantsControllerCreate({
            name: values.name,
            // TODO: ファイルアップロードにserverが対応したら修正する
            pic: '',
            genreId: values.genre_id,
          });

        const { error: menuError } = await api.menus.menusControllerCreate({
          menus: values.menus.map((menu) => ({
            name: menu.name,
            // TODO: ファイルアップロードにserverが対応したら修正する
            pic: '',
            ingredientIds: menu.ingredientIds,
          })),
          restaurantId: data.id,
        });

        if (error) throw error;
        if (menuError) throw menuError;

        reset();

        setPreview({ pic: undefined, 'menus.0.pic': undefined });

        toast({
          title: 'レストランを作成しました',
          status: 'success',
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'レストランを作成できませんでした',
          status: 'error',
          isClosable: true,
        });
      }
    },
    [toast, reset, setPreview]
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

  return { handleSubmit, handleFileChange };
};
