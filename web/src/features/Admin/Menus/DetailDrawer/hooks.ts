import { fileToBase64 } from '@/lib/file-util';
import { api } from '@/lib/swagger-client';
import { HttpResponse, MenuDto } from '@/types/generated/Api';
import { useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UseFieldArrayAppend, UseFormReset } from 'react-hook-form';
import { KeyedMutator } from 'swr';
import { FormValues, PreviewType } from '../index.d';

type TUseHandlerArgs = {
  isEdit: boolean;
  restaurantId: string;
  menu: MenuDto | undefined;
  reset: UseFormReset<FormValues>;
  append: UseFieldArrayAppend<FormValues, 'menus'>;
  onClose: () => void;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  mutate: KeyedMutator<HttpResponse<MenuDto[], any>>;
};

export const useHandler = ({
  isEdit,
  restaurantId,
  menu,
  reset,
  append,
  onClose,
  mutate,
}: TUseHandlerArgs) => {
  const [preview, setPreview] = useState<PreviewType>({});

  const toast = useToast();

  // menuが存在する場合、プレビュー画像としてmenu.picを表示する
  useEffect(() => {
    if (menu && menu.pic) {
      setPreview((prev) => ({ ...prev, 'menus.0.pic': menu.pic }));

      return;
    }

    // menu.picがない場合はプレビュー画像をreset
    setPreview({ 'menus.0.pic': undefined });
  }, [menu]);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        if (isEdit) {
        } else {
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
            restaurantId,
          });

          if (error) throw error;
        }

        reset();

        setPreview({ 'menus.0.pic': undefined });

        mutate();

        onClose();

        toast({
          title: `メニューを${isEdit ? '編集' : '作成'}しました`,
          status: 'success',
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: `メニューを${isEdit ? '編集' : '作成'}できませんでした`,
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

  return { preview, handleSubmit, handleChangeFile, handleAddMenu };
};

export const useDefaultValues = ({
  menu,
}: {
  menu: MenuDto | undefined;
}): FormValues => {
  const result = useMemo(
    () => ({
      menus: [
        {
          name: menu?.name ?? '',
          ingredientIds: menu
            ? menu.ingredients.map((ingredient) => ingredient.id)
            : [],
          pic: undefined,
        },
      ],
    }),
    [menu?.name, menu?.ingredients]
  );

  return result;
};
