import { Spinner } from '@/components/spinner';
import { ErrorSafePage } from '@/features/Error';
import { api } from '@/lib/swagger-client';
import {
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import useSWR from 'swr';
import { DetailDrawer } from './DetailDrawer';
import { useDetailDrawer } from './hooks';
import styles from './index.module.scss';

export const RestaurantsAdmin = (): JSX.Element => {
  const { state, handleOpen, handleClose } = useDetailDrawer();

  const { data, error, isLoading, mutate } = useSWR('/admin/restaurants', () =>
    api.restaurants.restaurantsControllerFind({ withDeleted: true })
  );

  const restaurants = data?.data ?? [];

  return !isLoading ? (
    <ErrorSafePage error={error}>
      <main className={styles.container}>
        <Grid mb={8}>
          <GridItem>
            <HStack spacing={6}>
              <Heading as='h3' size='lg'>
                レストラン一覧
              </Heading>
              <span>全{restaurants.length}件</span>
            </HStack>
          </GridItem>
          <GridItem colStart={20} colEnd={20}>
            <Button w='100%' onClick={() => handleOpen()}>
              新規作成
            </Button>
          </GridItem>
        </Grid>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th fontSize='md'>レストラン名</Th>
                <Th fontSize='md'>画像</Th>
                <Th fontSize='md'>ジャンル</Th>
                <Th fontSize='md'>営業状況</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {restaurants.map((restaurant) => (
                <Tr key={restaurant.id}>
                  <Td>{restaurant.name}</Td>
                  <Td>
                    {restaurant.pic && (
                      <Image width='24' height='20' src={restaurant.pic} />
                    )}
                  </Td>
                  <Td>
                    <Tag variant='outline' color='black'>
                      {restaurant.genre.name}
                    </Tag>
                  </Td>
                  <Td>
                    <Tag
                      variant='outline'
                      colorScheme={restaurant.deletedAt ? 'red' : 'blue'}
                    >
                      <TagLeftIcon
                        as={
                          restaurant.deletedAt ? FaTimesCircle : FaCheckCircle
                        }
                      />
                      <TagLabel>
                        {restaurant.deletedAt ? '営業停止中' : '営業中'}
                      </TagLabel>
                    </Tag>
                  </Td>
                  <Td>
                    <Button
                      colorScheme='teal'
                      size='xs'
                      onClick={() => handleOpen(restaurant.id)}
                    >
                      詳細
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </main>

      <DetailDrawer state={state} onClose={handleClose} mutate={mutate} />
    </ErrorSafePage>
  ) : (
    <Spinner color='green' />
  );
};
