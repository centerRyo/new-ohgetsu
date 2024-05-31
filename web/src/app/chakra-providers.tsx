'use client';

import theme from '@/lib/theme';
import { ChakraProvider } from '@chakra-ui/react';

const ChakraProviders = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

export default ChakraProviders;
