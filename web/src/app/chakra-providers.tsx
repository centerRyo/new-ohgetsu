'use client';

import { Toaster } from '@/components/toaster';
import system from '@/lib/theme';
import { ChakraProvider } from '@chakra-ui/react';

const ChakraProviders = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider value={system}>
    {children}
    <Toaster />
  </ChakraProvider>
);

export default ChakraProviders;
