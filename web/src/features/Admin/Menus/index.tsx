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
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import useSWR from 'swr';
import styles from './index.module.scss';

type Props = {
  restaurantId: string;
};

export const MenusAdmin = ({ restaurantId }: Props): JSX.Element => {
  const { data: restaurantData, isLoading: restaurantLoading } = useSWR(
    `/admin/restaurants/${restaurantId}/restaurant`,
    () => api.restaurants.restaurantsControllerFindOne(restaurantId)
  );

  const {
    data: menusData,
    error: menusError,
    isLoading: menusLoading,
  } = useSWR(`/admin/restaurants/${restaurantId}/menus`, () =>
    api.menus.menusControllerFindAll({ restaurantId })
  );

  const restaurant = restaurantData?.data;

  const menus = menusData?.data ?? [];

  const loading = restaurantLoading || menusLoading;

  return !loading ? (
    <ErrorSafePage error={menusError}>
      <main className={styles.container}>
        <Grid mb={8}>
          <GridItem>
            <HStack spacing={6}>
              <Heading as='h3' size='lg'>
                {restaurant?.name}のメニュー一覧
              </Heading>
              <span>全{menus.length}件</span>
            </HStack>
          </GridItem>
          <GridItem colStart={20} colEnd={20}>
            <Button w='100%' onClick={() => {}}>
              新規作成
            </Button>
          </GridItem>
        </Grid>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th fontSize='md'>メニュー名</Th>
                <Th fontSize='md'>写真</Th>
                <Th fontSize='md'>アレルギー物質</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {menus.map((menu) => (
                <Tr key={menu.id}>
                  <Td>{menu.name}</Td>
                  <Td>
                    <Image
                      width='24'
                      height='20'
                      src={menu.pic}
                      alt={menu.name}
                    />
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      {menu.ingredients.map((ingredient) => (
                        <Tag variant='solid' colorScheme='green'>
                          {ingredient.name}
                        </Tag>
                      ))}
                    </HStack>
                  </Td>
                  <Td>
                    <HStack spacing={4}>
                      <Button colorScheme='cyan' size='xs'>
                        詳細
                      </Button>
                      <Button colorScheme='red' size='xs'>
                        削除
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </main>
    </ErrorSafePage>
  ) : (
    <Spinner color='green' />
  );
};
