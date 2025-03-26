import { Spinner } from '@/components/spinner';
import { pagesPath } from '@/lib/$path';
import { api } from '@/lib/swagger-client';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import useSWR from 'swr';
import { ErrorSafePage } from '../Error';
import { useHandler } from './hooks';
import styles from './index.module.scss';
import { MenusSearchCondition } from './utils';

type Props = {
  searchConditions: MenusSearchCondition;
};

export const Menus = ({ searchConditions }: Props) => {
  const excludedIngredientIds = searchConditions.excludedIngredientIds
    ? searchConditions.excludedIngredientIds?.split(',')
    : [];

  const {
    data: restaurantData,
    error: restaurantError,
    isLoading: isRestaurantLoading,
  } = useSWR(`/restaurants/${searchConditions.restaurantId}`, () =>
    api.restaurants.restaurantsControllerFindOne(searchConditions.restaurantId)
  );

  const {
    data: menusData,
    error: menusError,
    isLoading: isMenusLoading,
  } = useSWR(`menus/?restaurantId=${searchConditions.restaurantId}`, () =>
    api.menus.menusControllerFindAll({
      restaurantId: searchConditions.restaurantId,
      ingredientIds: excludedIngredientIds,
    })
  );

  const {
    data: ingredientsData,
    error: ingredientsError,
    isLoading: isIngredientsLoading,
  } = useSWR('/ingredients', () =>
    api.ingredients.ingredientsControllerFindAll()
  );

  const restaurant = restaurantData?.data;

  const menus = menusData?.data || [];

  const ingredients =
    ingredientsData?.data.filter((ingredient) =>
      excludedIngredientIds.includes(ingredient.id)
    ) || [];

  const loading = isRestaurantLoading || isMenusLoading || isIngredientsLoading;

  const error = restaurantError || menusError || ingredientsError;

  const { handleBack } = useHandler({
    restaurantId: searchConditions.restaurantId,
  });

  return !loading ? (
    <ErrorSafePage error={error}>
      <div className={styles.container}>
        <Heading mb={8}>{restaurant?.name}</Heading>

        <Text mb={8}>メニューを選択してください。</Text>

        {ingredients.length > 0 && (
          <Flex
            className={styles.subtitle}
            alignItems='center'
            flexWrap='wrap'
            mb={8}
          >
            <Flex gap={2} alignItems='center' flexWrap='wrap'>
              {ingredients.map((ingredient) => (
                <span className={styles.ingredient} key={ingredient.id}>
                  {ingredient.name}
                </span>
              ))}
            </Flex>
            <Text fontWeight='bold' ml={2}>
              が含まれないメニュー
            </Text>
          </Flex>
        )}

        <section className={styles.menus}>
          {menus.length > 0 ? (
            <SimpleGrid
              spacing={4}
              templateColumns={{
                base: 'repeat(auto-fill, minmax(125px, 1fr))',
                md: 'repeat(auto-fill, minmax(200px, 1fr))',
              }}
            >
              {menus.map((menu) => (
                <Link
                  href={
                    pagesPath.menus
                      ._id(menu.id)
                      .$url({ query: searchConditions }).path
                  }
                  key={menu.id}
                >
                  <Card key={menu.id}>
                    <CardHeader>
                      <Box className={styles.imageWrap}>
                        <Image
                          src={menu.pic ?? '/images/no_image.png'}
                          fit='fill'
                          objectFit='cover'
                          borderRadius='md'
                          alt={menu.name}
                        />
                      </Box>
                    </CardHeader>
                    <CardBody>
                      <Heading size='md' noOfLines={3} height='72px'>
                        {menu.name}
                      </Heading>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </SimpleGrid>
          ) : (
            <Text>メニューがありません。。。</Text>
          )}
        </section>

        <Flex justifyContent='center'>
          <Button
            size='lg'
            colorScheme='green'
            variant='outline'
            onClick={handleBack}
          >
            アレルギー物質を変更して検索する
          </Button>
        </Flex>
      </div>
    </ErrorSafePage>
  ) : (
    <Spinner color='green' />
  );
};
