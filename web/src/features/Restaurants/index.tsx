import { pagesPath } from '@/lib/$path';
import { api } from '@/lib/swagger-client';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  SimpleGrid,
  Skeleton,
  Tag,
  Tooltip,
} from '@chakra-ui/react';
import Link from 'next/link';
import useSWR from 'swr';
import { ErrorSafePage } from '../Error';
import styles from './index.module.scss';
import { RestaurantsSearchCondition } from './utils';

type Props = {
  searchConditions: RestaurantsSearchCondition;
};

export const Restaurants = ({ searchConditions }: Props): JSX.Element => {
  const { search_query } = searchConditions;

  const { data, error, isLoading } = useSWR(
    search_query ? `/restaurants?search_query=${search_query}` : '/restaurants',
    () =>
      api.restaurants.restaurantsControllerFind({
        search_query,
      })
  );

  const restaurants = data?.data || [];

  return (
    <ErrorSafePage error={error}>
      <div className={styles.container}>
        <SimpleGrid
          spacing={4}
          templateColumns={{
            base: 'repeat(auto-fill, minmax(125px, 1fr))',
            md: 'repeat(auto-fill, minmax(200px, 1fr))',
          }}
        >
          {!isLoading
            ? restaurants.map((restaurant) => (
                <Link
                  href={pagesPath.restaurants._id(restaurant.id).$url().path}
                  key={restaurant.id}
                >
                  <Card key={restaurant.id}>
                    <CardHeader>
                      <Box className={styles.imageWrap}>
                        <Image
                          src={restaurant.pic ?? '/images/no_image.png'}
                          alt={restaurant.name}
                          fit='fill'
                          objectFit='cover'
                          borderRadius='md'
                        />
                      </Box>
                    </CardHeader>
                    <CardBody>
                      <Tooltip
                        label={restaurant.name}
                        hasArrow
                        bg='green'
                        fontWeight='bold'
                      >
                        <Heading size='md' noOfLines={2} height='48px'>
                          {restaurant.name}
                        </Heading>
                      </Tooltip>
                      <Tag
                        variant='outline'
                        mt={4}
                        color='black'
                        borderColor='#d8d9db'
                        fontWeight='600'
                      >
                        {restaurant.genre?.name}
                      </Tag>
                    </CardBody>
                  </Card>
                </Link>
              ))
            : [1, 2, 3, 4, 5, 6, 7, 8].map((_) => (
                <Skeleton height='250px' width='200px' key={_} />
              ))}
        </SimpleGrid>
      </div>
    </ErrorSafePage>
  );
};
