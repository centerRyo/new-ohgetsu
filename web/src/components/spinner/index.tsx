import { Spinner as ChakraSpinner, SpinnerProps } from '@chakra-ui/react';
import { memo } from 'react';
import styles from './index.module.scss';

type Props = Partial<{
  size: SpinnerProps['size'];
  borderWidth: SpinnerProps['borderWidth'];
  animationDuration: SpinnerProps['animationDuration'];
  color: string;
}>;

export const Spinner = memo(
  ({
    size = 'xl',
    borderWidth = '4px',
    animationDuration = '0.65s',
    color,
  }: Props) => (
    <div className={styles.container}>
      <ChakraSpinner
        size={size}
        borderWidth={borderWidth}
        animationDuration={animationDuration}
        color={color}
      />
    </div>
  )
);
Spinner.displayName = 'Spinner';
