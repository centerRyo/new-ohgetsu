import { Button, Flex, Heading, Skeleton } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import Ingredients from './Ingredients';
import { useHandler } from './hooks';
import { FormValues } from './index.d';
import styles from './index.module.scss';

type Props = {
  shopId: string;
};

const Shop = ({ shopId }: Props) => {
  const shop = {
    id: '1',
    name: 'Shop 1',
    address: 'Address 1',
    pic: '',
  };

  const loading = false;

  const { register, getValues } = useForm<FormValues>();
  const { handleClickSearch, handleBack } = useHandler({ getValues, shopId });

  return (
    <div className={styles.container}>
      {!loading ? (
        <Heading mb={9}>{shop.name}</Heading>
      ) : (
        <Skeleton height='2rem' mb={8} />
      )}

      <section className={styles.explanation}>
        <div className={styles.wrapper}>
          <p>アレルギー物質を選択してください</p>
          <p>(複数選択可)</p>
          <p>
            (選択した物質を
            <span className={styles.unused}>使用していない</span>
            メニューが表示されます)
          </p>
        </div>
      </section>

      <Ingredients register={register} />

      <Flex justifyContent='center'>
        <Button
          size='lg'
          colorScheme='green'
          width='100%'
          maxWidth='30rem'
          onClick={handleClickSearch}
        >
          検索
        </Button>
      </Flex>
      <Flex justifyContent='center' mt={8}>
        <Button
          size='lg'
          colorScheme='green'
          variant='outline'
          width='100%'
          maxWidth='30rem'
          onClick={handleBack}
        >
          店舗を再検索する
        </Button>
      </Flex>
    </div>
  );
};

export default Shop;
