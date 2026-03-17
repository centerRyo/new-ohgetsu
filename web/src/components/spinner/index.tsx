import { Spinner as ChakraSpinner } from '@chakra-ui/react';
import { memo } from 'react';
import styles from './index.module.scss';

type Props = Partial<{
  color: string;
}>;

export const Spinner = memo(({ color }: Props) => (
  <div className={styles.container}>
    <ChakraSpinner size='xl' borderWidth='4px' color={color} />
  </div>
));
Spinner.displayName = 'Spinner';
