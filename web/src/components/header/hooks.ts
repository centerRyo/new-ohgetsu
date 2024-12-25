import { pagesPath } from '@/lib/$path';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

type Props = {
  searchText: string;
  setSearchText: (text: string) => void;
  onClose: () => void;
};

export const useSearch = ({ searchText, setSearchText, onClose }: Props) => {
  const router = useRouter();

  const handleSearch = useCallback(() => {
    router.push(
      pagesPath.restaurants.$url({ query: { search_query: searchText } }).path
    );

    setSearchText('');

    onClose();
  }, [router, setSearchText, searchText, onClose]);

  return { handleSearch };
};
