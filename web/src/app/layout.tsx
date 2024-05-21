import Header from '@/components/header';
import { memo } from 'react';
import ChakraProviders from './chakra-providers';
import styles from './layout.module.scss';

type Props = {
  children: React.ReactNode;
};

const RootLayout = memo(({ children }: Props) => {
  return (
    <html lang='ja'>
      <body>
        <ChakraProviders>
          <div className={styles.container}>
            <div className={styles.header}>
              <Header />
            </div>

            <div className={styles.content}>{children}</div>
          </div>
        </ChakraProviders>
      </body>
    </html>
  );
});
RootLayout.displayName = 'RootLayout';

export default RootLayout;
