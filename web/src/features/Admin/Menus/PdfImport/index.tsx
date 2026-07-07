'use client';

import {
  Alert,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Stack,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  TableScrollArea,
  TagRoot,
  Text,
  Textarea,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { CellStatusToggle } from './CellStatusToggle';
import { useHandler, usePdfFile } from './hooks';
import styles from './index.module.scss';

type Props = {
  restaurantId: string;
};

export const PdfImport = ({ restaurantId }: Props) => {
  const router = useRouter();
  const { file, objectUrl, selectFile } = usePdfFile();
  const {
    state,
    parsing,
    submitting,
    handleParse,
    updateName,
    updateNote,
    updateCellStatus,
    handleRegister,
  } = useHandler({ restaurantId, file });

  const backToMenus = () =>
    router.push(`/admin/restaurants/${restaurantId}/menus`);

  return (
    <main className={styles.container}>
      <HStack justifyContent='space-between' mb={6}>
        <Heading as='h3' size='lg'>
          PDFからアレルゲン情報をインポート
        </Heading>
        <Button variant='outline' onClick={backToMenus}>
          メニュー一覧に戻る
        </Button>
      </HStack>

      {/* 解析前: アップロード欄 */}
      {!state && (
        <Stack className={styles.uploader} gap={4}>
          <Text fontSize='sm' color='gray.600'>
            テキスト埋め込みのアレルゲン表PDFをアップロードしてください。画像ベース(スキャン)のPDFは解析できません。
          </Text>
          <Input
            type='file'
            accept='application/pdf'
            p={1}
            onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
          />
          {file && (
            <Text fontSize='sm' color='gray.600'>
              選択中: {file.name}
            </Text>
          )}
          <Button
            colorPalette='green'
            fontWeight='bold'
            disabled={!file || parsing}
            loading={parsing}
            onClick={handleParse}
          >
            解析する
          </Button>
        </Stack>
      )}

      {/* 解析後: 左PDF(固定) / 右編集フォーム(スクロール) */}
      {state && (
        <div className={styles.split}>
          <div className={styles.pdfPane}>
            {objectUrl && (
              <iframe
                className={styles.pdfFrame}
                src={objectUrl}
                title='アップロードしたPDF'
              />
            )}
          </div>

          <div className={styles.formPane}>
            {state.unmatchedColumns.length > 0 && (
              <Alert.Root status='warning' mb={4}>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>照合できなかった列があります</Alert.Title>
                  <Alert.Description>
                    <Wrap gap={2} mt={1}>
                      {state.unmatchedColumns.map((u) => (
                        <WrapItem key={u.headerText}>
                          <TagRoot colorPalette='orange'>
                            {u.headerText}
                          </TagRoot>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}

            <HStack justifyContent='space-between' mb={3}>
              <Text fontWeight='bold'>{state.rows.length}件のメニュー候補</Text>
              <Button
                colorPalette='green'
                fontWeight='bold'
                loading={submitting}
                onClick={() => handleRegister(backToMenus)}
              >
                DB登録
              </Button>
            </HStack>

            <TableScrollArea>
              <TableRoot variant='outline' size='sm'>
                <TableHeader>
                  <TableRow>
                    <TableColumnHeader minW='16rem'>
                      メニュー名
                    </TableColumnHeader>
                    <TableColumnHeader minW='28rem'>
                      アレルゲン
                    </TableColumnHeader>
                    <TableColumnHeader minW='20rem'>
                      備考(接触の可能性)
                    </TableColumnHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell verticalAlign='top'>
                        <Input
                          size='sm'
                          value={row.name}
                          onChange={(e) => updateName(rowIndex, e.target.value)}
                        />
                      </TableCell>
                      <TableCell verticalAlign='top'>
                        <Wrap gap={3}>
                          {row.cells.map((cell) => (
                            <WrapItem key={cell.ingredientId}>
                              <Box>
                                <Text fontSize='xs' mb={1}>
                                  {cell.ingredientName}
                                </Text>
                                <CellStatusToggle
                                  value={cell.status}
                                  onChange={(status) =>
                                    updateCellStatus(
                                      rowIndex,
                                      cell.ingredientId as string,
                                      status
                                    )
                                  }
                                />
                              </Box>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </TableCell>
                      <TableCell verticalAlign='top'>
                        <Textarea
                          size='sm'
                          rows={3}
                          value={row.note ?? ''}
                          onChange={(e) => updateNote(rowIndex, e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableRoot>
            </TableScrollArea>
          </div>
        </div>
      )}
    </main>
  );
};
