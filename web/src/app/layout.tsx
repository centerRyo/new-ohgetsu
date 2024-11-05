import Header from '@/components/header';
import { GoogleAnalytics } from '@next/third-parties/google';
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
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string}
        />

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
