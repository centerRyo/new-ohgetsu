import { pagesPath } from '@/lib/$path';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

type Props = {
  searchText: string;
  setSearchText: (text: string) => void;
  setOpenDrawer: (open: boolean) => void;
};

export const useSearch = ({
  searchText,
  setSearchText,
  setOpenDrawer,
}: Props) => {
  const router = useRouter();

  const handleSearch = useCallback(() => {
    router.push(
      pagesPath.restaurants.$url({ query: { search_query: searchText } }).path
    );

    setSearchText('');

    setOpenDrawer(false);
  }, [router, setSearchText, searchText, setOpenDrawer]);

  return { handleSearch };
};
