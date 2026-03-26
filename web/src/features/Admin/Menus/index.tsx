import { Spinner } from '@/components/spinner';
import { ErrorSafePage } from '@/features/Error';
import { api } from '@/lib/swagger-client';
import {
  Box,
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
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { DetailDrawer } from './DetailDrawer';
import { useDetailDrawer } from './hooks/useDetailDrawer';
import { useRemoveMenu } from './hooks/useRemoveMenu';
import styles from './index.module.scss';

type Props = {
  restaurantId: string;
};

export const MenusAdmin = ({ restaurantId }: Props) => {
  const { state, handleOpen, handleClose } = useDetailDrawer();

  const { data: restaurantData, isLoading: restaurantLoading } = useSWR(
    `/admin/restaurants/${restaurantId}/restaurant`,
    () => api.restaurants.restaurantsControllerFindOne(restaurantId)
  );

  const {
    data: menusData,
    error: menusError,
    isLoading: menusLoading,
    mutate,
  } = useSWR(`/admin/restaurants/${restaurantId}/menus`, () =>
    api.menus.menusControllerFindAll({ restaurantId })
  );

  const restaurant = restaurantData?.data;

  const menus = menusData?.data ?? [];

  const loading = restaurantLoading || menusLoading;

  const { handleRemoveMenu } = useRemoveMenu({ onClose: handleClose, mutate });
  return !loading ? (
    <ErrorSafePage error={menusError}>
      <main className={styles.container}>
        <Grid mb={8}>
          <GridItem>
            <HStack gap={6}>
              <Heading as='h3' size='lg'>
                {restaurant?.name}のメニュー一覧
              </Heading>
              <span>全{menus.length}件</span>
            </HStack>
          </GridItem>
          <GridItem colStart={20} colEnd={20}>
            <Button w='100%' fontWeight='bold' onClick={() => handleOpen()}>
              新規作成
            </Button>
          </GridItem>
        </Grid>
        <TableScrollArea>
          <TableRoot variant='outline'>
            <TableHeader>
              <TableRow>
                <TableColumnHeader fontSize='md'>メニュー名</TableColumnHeader>
                <TableColumnHeader fontSize='md'>写真</TableColumnHeader>
                <TableColumnHeader fontSize='md'>
                  アレルギー物質
                </TableColumnHeader>
                <TableColumnHeader />
              </TableRow>
            </TableHeader>
            <TableBody>
              {menus.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell>{menu.name}</TableCell>
                  <TableCell>
                    {menu.pic && (
                      <Image
                        width='24'
                        height='20'
                        src={menu.pic}
                        alt={menu.name}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box maxW='200px'>
                      <Wrap gap={2}>
                        {menu.ingredients.map((ingredient) => (
                          <WrapItem key={ingredient.id}>
                            <TagRoot variant='solid' colorPalette='green'>
                              {ingredient.name}
                            </TagRoot>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <HStack gap={4}>
                      <Button
                        colorPalette='cyan'
                        size='xs'
                        onClick={() => handleOpen(menu.id)}
                      >
                        詳細
                      </Button>
                      <Button
                        colorPalette='red'
                        size='xs'
                        onClick={() => handleRemoveMenu(menu.id)}
                      >
                        削除
                      </Button>
                    </HStack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        </TableScrollArea>
      </main>

      <DetailDrawer
        state={state}
        restaurantId={restaurantId}
        onClose={handleClose}
        mutate={mutate}
      />
    </ErrorSafePage>
  ) : (
    <Spinner color='green' />
  );
};
