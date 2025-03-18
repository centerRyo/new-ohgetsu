import { HttpResponse, MenuDto } from '@/types/generated/Api';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
} from '@chakra-ui/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { KeyedMutator } from 'swr';
import { DetailDrawerState, FormValues } from '../index.d';
import { useHandler } from './hooks';
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control,
    reset,
  } = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: { menus: [{ name: '', ingredientIds: [], pic: undefined }] },
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
    reset,
    append,
    onClose,
    mutate,
  });

  return (
    <Drawer isOpen={state.open} placement='right' size='md' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
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
                      icon={<FaTrash />}
                      colorScheme='red'
                      size='sm'
                      onClick={() => remove(index)}
                      variant='ghost'
                    />
                  )}
                </Flex>
                <Flex mb={6}>
                  <FormControl
                    isInvalid={
                      errors.menus && !!errors.menus[index]?.name?.message
                    }
                  >
                    <Flex alignItems='center' gap={4} mb={2}>
                      <FormLabel className={styles.label} htmlFor='menu_name'>
                        メニュー
                      </FormLabel>
                      <span className={styles.required}>必須</span>
                    </Flex>
                    <Input
                      type='text'
                      {...register(`menus.${index}.name`, {
                        required: 'メニューは必須です',
                      })}
                    />
                    <FormErrorMessage>
                      {errors.menus &&
                        errors.menus[index]?.name?.message?.toString()}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>
                <Flex mb={6}>
                  <Ingredients
                    errors={errors}
                    control={control}
                    index={index}
                  />
                </Flex>
                <Flex>
                  <FormControl>
                    <Flex mb={2}>
                      <FormLabel className={styles.label}>写真</FormLabel>
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
                  </FormControl>
                </Flex>
              </Box>
            ))}

            <Button onClick={handleAddMenu}>メニューを追加</Button>
          </form>
        </DrawerBody>

        <DrawerFooter>
          <Button
            colorScheme='green'
            isDisabled={!isValid}
            isLoading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            保存
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
