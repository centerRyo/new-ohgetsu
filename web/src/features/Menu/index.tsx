import { Spinner } from '@/components/spinner';
import { api } from '@/lib/swagger-client';
import {
  Button,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { ErrorSafePage } from '../Error';
import { MenusSearchCondition } from '../Menus/utils';
import { useHandler } from './hooks';
import styles from './index.module.scss';

type Props = {
  menuId: string;
  searchConditions: MenusSearchCondition;
};

export const Menu = ({ menuId, searchConditions }: Props) => {
  const {
    data: restaurantData,
    error: restaurantError,
    isLoading: isRestaurantLoading,
  } = useSWR(`/restaurants/${searchConditions.restaurantId}`, () =>
    api.restaurants.restaurantsControllerFindOne(searchConditions.restaurantId)
  );

  const {
    data: menuData,
    error: menuError,
    isLoading: isMenuLoading,
  } = useSWR(`/menus/${menuId}`, () =>
    api.menus.menusControllerFindOne(menuId)
  );

  const restaurant = restaurantData?.data;

  const menu = menuData?.data;

  const loading = isRestaurantLoading || isMenuLoading;

  const error = restaurantError || menuError;

  const { handleBack, handleSearchMenus, handleSearchRestaurants } = useHandler(
    { searchConditions }
  );

  return !loading ? (
    <ErrorSafePage error={error}>
      <div className={styles.container}>
        <Heading mb={8}>{restaurant?.name}</Heading>

        <Flex mb={8} className={styles.subTitle}>
          {menu?.name}
        </Flex>

        <Flex maxWidth='30rem' margin='0 auto' mb={8}>
          <Image
            src={
              menu?.pic
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${menu?.pic}`
                : '/images/no_image.png'
            }
            fit='fill'
            alt={menu?.name}
          />
        </Flex>

        <div className={styles.explanation}>
          本商品に含まれているアレルギー物質
        </div>
        <section className={styles.ingredients}>
          <SimpleGrid
            spacing={4}
            templateColumns='repeat(auto-fill, minmax(125px, 1fr))'
          >
            {menu?.ingredients.map((ingredient) => (
              <Flex
                maxW='sm'
                padding='25px 10px'
                flexDir='column'
                alignItems='center'
                gap={4}
                className={styles.ingredient}
                key={ingredient.id}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${ingredient.pic}`}
                  fit='fill'
                  alt={ingredient.name}
                />
                <Text fontWeight='bold'>{ingredient.name}</Text>
              </Flex>
            ))}
          </SimpleGrid>
        </section>

        <Flex justifyContent='center' mb={8}>
          <Button
            size='lg'
            colorScheme='green'
            variant='outline'
            w='336px'
            maxW='100%'
            onClick={handleBack}
          >
            検索結果にもどる
          </Button>
        </Flex>
        <Flex justifyContent='center' mb={8}>
          <Button
            size='lg'
            colorScheme='green'
            variant='outline'
            w='336px'
            maxW='100%'
            onClick={handleSearchMenus}
          >
            アレルギー物質を変更して検索する
          </Button>
        </Flex>
        <Flex justifyContent='center'>
          <Button
            size='lg'
            colorScheme='green'
            variant='outline'
            w='336px'
            maxW='100%'
            onClick={handleSearchRestaurants}
          >
            店舗を再検索する
          </Button>
        </Flex>
      </div>
    </ErrorSafePage>
  ) : (
    <Spinner color='green' />
  );
};
