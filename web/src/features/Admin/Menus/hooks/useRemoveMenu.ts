import { api } from '@/lib/swagger-client';
import { HttpResponse, MenuDto } from '@/types/generated/Api';
import { toaster } from '@/components/toaster';
import { useCallback } from 'react';
import { KeyedMutator } from 'swr';

type Props = {
  onClose: () => void;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  mutate: KeyedMutator<HttpResponse<MenuDto[], any>>;
};

export const useRemoveMenu = ({ onClose, mutate }: Props) => {
  const handleRemoveMenu = useCallback(
    async (id: string) => {
      try {
        const confirmed = window.confirm('本当に削除してもいいですか？');

        if (!confirmed) return;

        const { error } = await api.menus.menusControllerRemove(id);

        if (error) throw error;

        onClose();

        mutate();

        toaster.create({
          title: 'メニューを削除しました',
          type: 'success',
        });
      } catch {
        toaster.create({
          title: 'メニューを削除できませんでした',
          type: 'error',
        });
      }
    },
    [onClose, mutate]
  );

  return { handleRemoveMenu };
};
