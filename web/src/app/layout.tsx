import { memo } from 'react';
import ChakraProviders from './chakra-providers';

type Props = {
  children: React.ReactNode;
};

const RootLayout = memo(({ children }: Props) => {
  return (
    <html lang='ja'>
      <body>
        <ChakraProviders>{children}</ChakraProviders>
      </body>
    </html>
  );
});
RootLayout.displayName = 'RootLayout';

export default RootLayout;
