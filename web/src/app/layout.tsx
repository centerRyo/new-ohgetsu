import { memo } from 'react';

type Props = {
  children: React.ReactNode;
};

const RootLayout = memo(({ children }: Props) => {
  return (
    <html lang='ja'>
      <body>{children}</body>
    </html>
  );
});
RootLayout.displayName = 'RootLayout';

export default RootLayout;
