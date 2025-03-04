import { toaster } from '@/components/toaster';
import { api } from '@/lib/swagger-client';
import React, { useCallback } from 'react';
import { UseFormReset } from 'react-hook-form';
import { FormValues, PreviewType } from './index.d';

type TUseHandlerArgs = {
  preview: PreviewType;
  setPreview: (preview: PreviewType) => void;
  reset: UseFormReset<FormValues>;
};

export const useHandler = ({ preview, setPreview, reset }: TUseHandlerArgs) => {
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const { error } = await api.restaurants.restaurantsControllerCreate({
          ...values,
          pic: values.pic ? values.pic[0] : undefined,
        });

        if (error) throw error;

        reset();

        setPreview({ pic: undefined });

        toaster.create({
          title: 'レストランを作成しました',
          type: 'success',
        });
      } catch (error) {
        toaster.create({
          title: 'レストランを作成できませんでした',
          type: 'error',
        });
      }
    },
    [reset, setPreview]
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
