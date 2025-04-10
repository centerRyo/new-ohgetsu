import { Spinner } from '@/components/spinner';
import { ErrorSafePage } from '@/features/Error';
import { api } from '@/lib/swagger-client';
import {
  Button,
  createListCollection,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Table,
  Tag,
} from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import useSWR from 'swr';
import { DetailDrawer } from './DetailDrawer';
import { useDetailDrawer } from './hooks/useDetailDrawer';
import { useMenusNavigation } from './hooks/useMenusNavigation';
import styles from './index.module.scss';

export const RestaurantsAdmin = (): JSX.Element => {
  const { state, handleOpen, handleClose } = useDetailDrawer();
  const { handleClickMenuManagement } = useMenusNavigation();

  const { data, error, isLoading, mutate } = useSWR('/admin/restaurants', () =>
    api.restaurants.restaurantsControllerFind({ withDeleted: true })
  );

  const restaurants = data?.data ?? [];

  const frameworks = createListCollection({
    items: [
      { label: 'React.js', value: 'react' },
      { label: 'Vue.js', value: 'vue' },
      { label: 'Angular', value: 'angular' },
      { label: 'Svelte', value: 'svelte' },
    ],
  });

  return !isLoading ? (
    <ErrorSafePage error={error}>
      <main className={styles.container}>
        <Grid mb={8}>
          <GridItem>
            <HStack gap={6}>
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
        <Table.Root variant='line' stickyHeader>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader fontSize='md'>
                レストラン名
              </Table.ColumnHeader>
              <Table.ColumnHeader fontSize='md'>写真</Table.ColumnHeader>
              <Table.ColumnHeader fontSize='md'>ジャンル</Table.ColumnHeader>
              <Table.ColumnHeader fontSize='md'>営業状況</Table.ColumnHeader>
              <Table.ColumnHeader />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {restaurants.map((restaurant) => (
              <Table.Row key={restaurant.id}>
                <Table.Cell>{restaurant.name}</Table.Cell>
                <Table.Cell>
                  {restaurant.pic && (
                    <Image
                      width='24'
                      height='20'
                      src={restaurant.pic}
                      alt={restaurant.name}
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Tag.Root variant='outline' color='black'>
                    <Tag.Label>{restaurant.genre.name}</Tag.Label>
                  </Tag.Root>
                </Table.Cell>
                <Table.Cell>
                  <Tag.Root
                    variant='outline'
                    colorPalette={restaurant.deletedAt ? 'red' : 'blue'}
                  >
                    <Tag.StartElement
                      as={restaurant.deletedAt ? FaTimesCircle : FaCheckCircle}
                    />
                    <Tag.Label>
                      {restaurant.deletedAt ? '営業停止中' : '営業中'}
                    </Tag.Label>
                  </Tag.Root>
                </Table.Cell>
                <Table.Cell>
                  <HStack gap={4}>
                    <Button
                      colorPalette='teal'
                      size='xs'
                      onClick={() => handleOpen(restaurant.id)}
                    >
                      詳細
                    </Button>
                    <Button
                      colorPalette='purple'
                      size='xs'
                      onClick={() => handleClickMenuManagement(restaurant.id)}
                    >
                      メニュー管理
                    </Button>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </main>

      <DetailDrawer state={state} onClose={handleClose} mutate={mutate} />
    </ErrorSafePage>
  ) : (
    <Spinner color='green' />
  );
};
