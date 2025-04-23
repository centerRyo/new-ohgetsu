'use client';

import { useState } from 'react';
import { HeaderPresenter } from './Presenter';
import { useSearch } from './hooks';

export const Header = (): JSX.Element => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const { handleSearch } = useSearch({
    searchText,
    setSearchText,
    setOpenDrawer,
  });

  return (
    <HeaderPresenter
      openDrawer={openDrawer}
      searchText={searchText}
      setSearchText={setSearchText}
      setOpenDrawer={setOpenDrawer}
      handleSearch={handleSearch}
    />
  );
};
