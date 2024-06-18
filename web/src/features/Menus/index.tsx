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
  Spinner,
  Text,
} from '@chakra-ui/react';
import useSWR from 'swr';
import styles from './index.module.scss';
import { MenusSearchCondition } from './utils';

type Props = {
  searchConditions: MenusSearchCondition;
};

export const Menus = ({ searchConditions }: Props) => {
  const { data } = useSWR(`/restaurants/${searchConditions.restaurantId}`, () =>
    api.restaurants.restaurantsControllerFindOne(searchConditions.restaurantId)
  );

  const excludedIngredientIds = searchConditions.excludedIngredientIds
    ? searchConditions.excludedIngredientIds?.split(',')
    : [];

  const { data: menusData } = useSWR(
    `menus/?restaurantId=${searchConditions.restaurantId}`,
    () =>
      api.menus.menusControllerFindAll({
        restaurantId: searchConditions.restaurantId,
        ingredientIds: excludedIngredientIds,
      })
  );

  const restaurant = data?.data;

  const ingredients = [
    {
      id: '1',
      name: 'ingredient1',
    },
    {
      id: '2',
      name: 'ingredient2',
    },
  ];

  const menus = menusData?.data || [];

  const loading = false;

  return !loading ? (
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
            templateColumns='repeat(auto-fill, minmax(200px, 1fr))'
          >
            {menus.map((menu) => (
              // <Link
              //   href={pagesPath.menus
              //     ._id(menu.id)
              //     .$url({ query: searchCondition })}
              //   key={menu.id}
              // >
              <Card key={menu.id}>
                <CardHeader>
                  <Box className={styles.imageWrap}>
                    <Image
                      src={
                        menu?.pic
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${menu?.pic}`
                          : '/images/no_image.png'
                      }
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
              // </Link>
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
          // onClick={handleBack}
        >
          アレルギー物質を変更して検索する
        </Button>
      </Flex>
    </div>
  ) : (
    <Spinner color='green' />
  );
};
