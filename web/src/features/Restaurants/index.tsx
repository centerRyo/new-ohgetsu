import { Tooltip } from '@/components/tooltip';
import { pagesPath } from '@/lib/$path';
import { api } from '@/lib/swagger-client';
import {
  Box,
  Card,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Skeleton,
  Tag,
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
          gap={4}
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
                  <Card.Root key={restaurant.id}>
                    <Card.Header>
                      <Box className={styles.imageWrap}>
                        <Image
                          src={restaurant.pic ?? '/images/no_image.png'}
                          alt={restaurant.name}
                          fit='fill'
                          objectFit='cover'
                          borderRadius='md'
                        />
                      </Box>
                    </Card.Header>
                    <Card.Body>
                      <Tooltip
                        content={restaurant.name}
                        showArrow
                        contentProps={{
                          css: {
                            '--tooltip-bg': 'colors.green.400',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        <Heading size='md' height='48px'>
                          {restaurant.name}
                        </Heading>
                      </Tooltip>
                      <HStack>
                        <Tag.Root
                          variant='outline'
                          mt={4}
                          colorPalette='black'
                          fontWeight='600'
                          size='sm'
                        >
                          <Tag.Label>{restaurant.genre?.name}</Tag.Label>
                        </Tag.Root>
                      </HStack>
                    </Card.Body>
                  </Card.Root>
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
