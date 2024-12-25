'use client';

import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { HeaderPresenter } from './Presenter';
import { useSearch } from './hooks';

export const Header = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchText, setSearchText] = useState<string>('');

  const { handleSearch } = useSearch({ searchText, setSearchText, onClose });

  return (
    <HeaderPresenter
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      searchText={searchText}
      setSearchText={setSearchText}
      handleSearch={handleSearch}
    />
  );
};
