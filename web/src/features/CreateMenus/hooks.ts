import { api } from '@/lib/swagger-client';
import { useToast } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { UseFieldArrayAppend, UseFormReset } from 'react-hook-form';
import { FormValues, PreviewType } from './index.d';

type TUseHandlerArgs = {
  preview: PreviewType;
  setPreview: (preview: PreviewType) => void;
  reset: UseFormReset<FormValues>;
  append: UseFieldArrayAppend<FormValues, 'menus'>;
};

export const useHandler = ({
  preview,
  setPreview,
  reset,
  append,
}: TUseHandlerArgs) => {
  const toast = useToast();

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const { error } = await api.menus.menusControllerCreate({
          menus: values.menus.map((menu) => ({
            name: menu.name,
            // TODO: ファイルアップロードにserverが対応したら修正する
            pic: '',
            ingredientIds: menu.ingredientIds,
          })),
          restaurantId: values.restaurantId,
        });

        if (error) throw error;

        reset();

        setPreview({ 'menus.0.pic': undefined });

        toast({
          title: 'メニューを作成しました',
          status: 'success',
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'メニューを作成できませんでした',
          status: 'error',
          isClosable: true,
        });
      }
    },
    [toast, reset, setPreview]
  );

  const handleChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;

      if (!files) return;

      const name = e.target.name;

      setPreview({ ...preview, [name]: URL.createObjectURL(files[0]) });
    },
    [preview, setPreview]
  );

  const handleAddMenu = () =>
    append([{ name: '', ingredientIds: [], pic: undefined }]);

  return { handleSubmit, handleChangeFile, handleAddMenu };
};