'use client';

import { system } from '@/lib/theme';
import { ChakraProvider } from '@chakra-ui/react';

const ChakraProviders = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={system}>{children}</ChakraProvider>
);

export default ChakraProviders;
