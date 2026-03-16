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
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  TableScrollArea,
  TagRoot,
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
        <TableScrollArea>
          <TableRoot variant='outline'>
            <TableHeader>
              <TableRow>
                <TableColumnHeader fontSize='md'>レストラン名</TableColumnHeader>
                <TableColumnHeader fontSize='md'>写真</TableColumnHeader>
                <TableColumnHeader fontSize='md'>ジャンル</TableColumnHeader>
                <TableColumnHeader fontSize='md'>営業状況</TableColumnHeader>
                <TableColumnHeader />
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell>{restaurant.name}</TableCell>
                  <TableCell>
                    {restaurant.pic && (
                      <Image
                        width='24'
                        height='20'
                        src={restaurant.pic}
                        alt={restaurant.name}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <TagRoot variant='outline' color='black'>
                      {restaurant.genre.name}
                    </TagRoot>
                  </TableCell>
                  <TableCell>
                    <TagRoot
                      variant='outline'
                      colorPalette={restaurant.deletedAt ? 'red' : 'blue'}
                    >
                      {restaurant.deletedAt ? (
                        <FaTimesCircle />
                      ) : (
                        <FaCheckCircle />
                      )}
                      {restaurant.deletedAt ? '営業停止中' : '営業中'}
                    </TagRoot>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        </TableScrollArea>
      </main>

      <DetailDrawer state={state} onClose={handleClose} mutate={mutate} />
    </ErrorSafePage>
  ) : (
    <Spinner color='green' />
  );
};
