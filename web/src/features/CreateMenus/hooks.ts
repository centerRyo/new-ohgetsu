import { toaster } from '@/components/toaster';
import { fileToBase64 } from '@/lib/file-util';
import { api } from '@/lib/swagger-client';
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
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const menus = await Promise.all(
          values.menus.map(async (menu) => ({
            ...menu,
            pic:
              menu.pic && menu.pic.length > 0
                ? await fileToBase64(menu.pic[0])
                : undefined,
          }))
        );

        const { error } = await api.menus.menusControllerCreate({
          menus,
          restaurantId: values.restaurantId,
        });

        if (error) throw error;

        reset();

        setPreview({ 'menus.0.pic': undefined });

        toaster.create({
          title: 'メニューを作成しました',
          type: 'success',
        });
      } catch (error) {
        toaster.create({
          title: 'メニューを作成できませんでした',
          type: 'error',
        });
      }
    },
    [reset, setPreview]
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
