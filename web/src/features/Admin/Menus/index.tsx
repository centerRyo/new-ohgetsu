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
import styles from './index.module.scss';

type Props = {
  restaurantId: string;
};

export const MenusAdmin = ({ restaurantId }: Props): JSX.Element => {
  return (
    <main className={styles.container}>
      <Grid mb={8}>
        <GridItem>
          <HStack spacing={6}>
            <Heading as='h3' size='lg'>
              レストラン1のメニュー一覧
            </Heading>
            <span>全〇〇件</span>
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
            <Tr>
              <Td>ちゃぶとんらぁめん</Td>
              <Td>
                <Image width='24' height='20' src='' alt='' />
              </Td>
              <Td>
                <Tag variant='solid' colorScheme='green'>
                  卵
                </Tag>
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
          </Tbody>
        </Table>
      </TableContainer>
    </main>
  );
};
