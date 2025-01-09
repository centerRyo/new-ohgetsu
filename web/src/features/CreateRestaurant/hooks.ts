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
        const { error } = await api.restaurants.restaurantsControllerCreate({
          name: values.name,
          pic: values.pic ? values.pic[0] : undefined,
          genreId: values.genre_id,
        });

        if (error) throw error;

        reset();

        setPreview({ pic: undefined });

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
