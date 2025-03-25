import { api } from '@/lib/swagger-client';
import { HttpResponse, MenuDto } from '@/types/generated/Api';
import { useToast } from '@chakra-ui/react';
import { useCallback } from 'react';
import { KeyedMutator } from 'swr';

type Props = {
  onClose: () => void;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  mutate: KeyedMutator<HttpResponse<MenuDto[], any>>;
};

export const useRemoveMenu = ({ onClose, mutate }: Props) => {
  const toast = useToast();

  const handleRemoveMenu = useCallback(
    async (id: string) => {
      try {
        const confirmed = window.confirm('本当に削除してもいいですか？');

        if (!confirmed) return;

        const { error } = await api.menus.menusControllerRemove(id);

        if (error) throw error;

        onClose();

        mutate();

        toast({
          title: 'メニューを削除しました',
          status: 'success',
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'メニューを削除できませんでした',
          status: 'error',
          isClosable: true,
        });
      }
    },
    [onClose, mutate, toast]
  );

  return { handleRemoveMenu };
};
