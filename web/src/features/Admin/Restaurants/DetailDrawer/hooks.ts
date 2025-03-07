import { api } from '@/lib/swagger-client';
import { HttpResponse, RestaurantDto } from '@/types/generated/Api';
import { useToast } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { UseFormReset } from 'react-hook-form';
import { KeyedMutator } from 'swr';
import { FormValues, PreviewType } from '../index.d';

type TUseHandlerArgs = {
  onClose: () => void;
  reset: UseFormReset<FormValues>;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  mutate: KeyedMutator<HttpResponse<RestaurantDto[], any>>;
};

export const useHandler = ({ onClose, reset, mutate }: TUseHandlerArgs) => {
  const [preview, setPreview] = useState<PreviewType>({});

  const toast = useToast();

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

        mutate();

        onClose();

        toast({
          title: 'レストランを作成しました',
          status: 'success',
          isClosable: true,
        });
      } catch (error) {
        onClose();

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

  return { preview, handleSubmit, handleFileChange };
};
