import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
} from '@/components/drawer';
import { api } from '@/lib/swagger-client';
import { HttpResponse, MenuDto } from '@/types/generated/Api';
import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import useSWR, { KeyedMutator } from 'swr';
import { DetailDrawerState, FormValues } from '../index.d';
import { useDefaultValues, useHandler } from './hooks';
import styles from './index.module.scss';
import Ingredients from './Ingredients';

type Props = {
  state: DetailDrawerState;
  restaurantId: string;
  onClose: () => void;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  mutate: KeyedMutator<HttpResponse<MenuDto[], any>>;
};

export const DetailDrawer = ({
  state,
  restaurantId,
  onClose,
  mutate,
}: Props): JSX.Element => {
  const isEdit = !!state.menuId;

  const { data } = useSWR(isEdit ? `/admin/menus/${state.menuId}` : null, () =>
    api.menus.menusControllerFindOne(state.menuId as string)
  );

  const menu = data?.data;

  const defaultValues = useDefaultValues({ menu });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control,
    reset,
  } = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'menus' });

  const {
    preview,
    handleChangeFile,
    handleSubmit: onSubmit,
    handleAddMenu,
  } = useHandler({
    isEdit,
    restaurantId,
    menu,
    reset,
    append,
    onClose,
    mutate,
  });

  // react-hook-formのdefaultValuesは初期レンダリング時にセットされる
  // data取得時に変更されないので、defaultValuesが変更されたときにresetする必要がある
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <DrawerRoot
      open={state.open}
      placement='end'
      size='md'
      onOpenChange={onClose}
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerCloseTrigger />
        <DrawerHeader>メニュー{isEdit ? '編集' : '追加'}</DrawerHeader>

        <DrawerBody>
          <form className={styles.form}>
            {fields.map((field, index) => (
              <Box
                key={field.id}
                borderRadius='md'
                borderWidth='1px'
                p={4}
                mb={6}
              >
                <Flex justifyContent='space-between' alignItems='center' mb={4}>
                  <Heading size='md'>メニュー項目 {index + 1}</Heading>
                  {index !== 0 && (
                    <IconButton
                      aria-label='メニュー項目を削除'
                      colorScheme='red'
                      size='sm'
                      onClick={() => remove(index)}
                      variant='ghost'
                    >
                      <FaTrash />
                    </IconButton>
                  )}
                </Flex>
                <Flex mb={6}>
                  <Field.Root
                    invalid={
                      errors.menus && !!errors.menus[index]?.name?.message
                    }
                  >
                    <Flex alignItems='center' gap={4} mb={2}>
                      <Field.Label className={styles.label} htmlFor='menu_name'>
                        メニュー
                      </Field.Label>
                      <span className={styles.required}>必須</span>
                    </Flex>
                    <Input
                      type='text'
                      {...register(`menus.${index}.name`, {
                        required: 'メニューは必須です',
                      })}
                    />
                    <Field.ErrorText>
                      {errors.menus &&
                        errors.menus[index]?.name?.message?.toString()}
                    </Field.ErrorText>
                  </Field.Root>
                </Flex>
                <Flex mb={6}>
                  <Ingredients
                    errors={errors}
                    control={control}
                    index={index}
                  />
                </Flex>
                <Flex>
                  <Field.Root>
                    <Flex mb={2}>
                      <Field.Label className={styles.label}>写真</Field.Label>
                    </Flex>
                    <Input
                      type='file'
                      {...register(`menus.${index}.pic`)}
                      accept='image/*'
                      onChange={handleChangeFile}
                    />
                    {/* @ts-ignore */}
                    {preview[`menus.${index}.pic`] && (
                      <Image
                        // @ts-ignore
                        src={preview[`menus.${index}.pic`]}
                        alt='プレビュー画像'
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                        }}
                        width='200'
                        height='200'
                      />
                    )}
                  </Field.Root>
                </Flex>
              </Box>
            ))}

            {!isEdit && <Button onClick={handleAddMenu}>メニューを追加</Button>}
          </form>
        </DrawerBody>

        <DrawerFooter>
          <Button
            colorScheme='green'
            disabled={!isValid}
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            保存
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};
