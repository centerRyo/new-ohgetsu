import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Skeleton,
  Tag,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { memo } from 'react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import styles from './index.module.scss';

const Restaurants = memo(() => {
  const restaurants = [
    {
      id: 1,
      name: 'Restaurant 1',
      pic: '',
      genre: {
        id: 1,
        name: 'Genre 1',
      },
      address: 'test address',
    },
  ];
  const loading = false;

  return (
    <div className={styles.container}>
      <SimpleGrid
        spacing={4}
        templateColumns='repeat(auto-fill, minmax(200px, 1fr))'
      >
        {!loading
          ? restaurants.map((restaurant) => (
              // <Link href={pagesPath.restaurants._id(restaurant.id).$url()} key={restaurant.id}>
              <Card key={restaurant.id}>
                <CardHeader>
                  <Box className={styles.imageWrap}>
                    <Image
                      src={
                        restaurant.pic
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${restaurant.pic}`
                          : '/images/no_image.png'
                      }
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
                  <Flex mt={4} alignItems='baseline'>
                    <HiOutlineLocationMarker className={styles.location} />
                    <Text ml={2} noOfLines={2} height='48px'>
                      {restaurant.address}
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
              // </Link>
            ))
          : [1, 2, 3, 4, 5, 6, 7, 8].map((_) => (
              <Skeleton height='250px' width='200px' key={_} />
            ))}
      </SimpleGrid>
    </div>
  );
});
Restaurants.displayName = 'Restaurants';

export default Restaurants;
