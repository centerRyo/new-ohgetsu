import { api } from '@/lib/swagger-client';
import { HttpResponse, RestaurantDto } from '@/types/generated/Api';
import {
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
  Image,
  Input,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useSWR, { KeyedMutator } from 'swr';
import { DetailDrawerState, FormValues } from '../index.d';
import Genres from './Genres';
import { useDefaultValues, useHandler } from './hooks';
import styles from './index.module.scss';

type Props = {
  state: DetailDrawerState;
  onClose: () => void;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  mutate: KeyedMutator<HttpResponse<RestaurantDto[], any>>;
};

export const DetailDrawer = ({
  state,
  onClose,
  mutate,
}: Props): JSX.Element => {
  const isEdit = !!state.restaurantId;

  const { data } = useSWR(
    isEdit ? `/admin/restaurant/${state.restaurantId}` : null,
    () =>
      api.restaurants.restaurantsControllerFindOne(state.restaurantId as string)
  );

  const restaurant = data?.data;

  const defaultValues = useDefaultValues({ restaurant });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    control,
  } = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues,
  });

  const {
    preview,
    handleSubmit: onSubmit,
    handleFileChange,
  } = useHandler({
    isEdit,
    restaurant,
    onClose,
    reset,
    mutate,
  });

  // react-hook-formのdefaultValuesは初期レンダリング時にセットされる
  // data取得時に変更されないので、defaultValuesが変更されたときにresetする必要がある
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Drawer isOpen={state.open} placement='right' size='md' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>レストラン{isEdit ? '編集' : '追加'}</DrawerHeader>

        <DrawerBody>
          <form className={styles.form}>
            <Flex mb={8}>
              <FormControl isInvalid={!!errors.name?.message}>
                <Flex alignItems='center' gap={4} mb={2}>
                  <FormLabel htmlFor='name' className={styles.label}>
                    レストラン名
                  </FormLabel>
                  <span className={styles.required}>必須</span>
                </Flex>
                <Input
                  id='name'
                  {...register('name', {
                    required: '店名は必須です',
                  })}
                  type='text'
                />
                <FormErrorMessage>
                  {errors.name?.message?.toString()}
                </FormErrorMessage>
              </FormControl>
            </Flex>

            <Flex mb={8}>
              <FormControl>
                <Flex mb={2}>
                  <FormLabel htmlFor='file' className={styles.label}>
                    レストランの写真
                  </FormLabel>
                </Flex>
                <Input
                  type='file'
                  {...register('pic')}
                  accept='image/*'
                  onChange={handleFileChange}
                />
                {preview.pic && (
                  <Image
                    src={preview.pic}
                    alt={preview.pic}
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

            <Flex mb={8}>
              <Genres errors={errors} register={register} />
            </Flex>

            <FormControl>
              <Controller
                name='isOpen'
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Flex alignItems='center' gap={4}>
                    <Text>{isEdit ? '営業停止' : '未営業'}</Text>
                    <Switch
                      isChecked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      ref={ref}
                    />
                    <Text>{isEdit ? '営業中' : '営業開始'}</Text>
                  </Flex>
                )}
              />
            </FormControl>
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
