import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from '@/components/drawer';
import { api } from '@/lib/swagger-client';
import { HttpResponse, RestaurantDto } from '@/types/generated/Api';
import {
  Button,
  Field,
  Flex,
  Image,
  Input,
  Switch,
  SwitchHiddenInput,
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
    <DrawerRoot
      open={state.open}
      placement='end'
      size='md'
      onOpenChange={onClose}
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerCloseTrigger />
        <DrawerHeader>
          <DrawerTitle>レストラン{isEdit ? '編集' : '追加'}</DrawerTitle>
        </DrawerHeader>

        <DrawerBody>
          <form className={styles.form}>
            <Flex mb={8}>
              <Field.Root invalid={!!errors.name?.message} required>
                <Flex alignItems='center' gap={4} mb={2}>
                  <Field.Label htmlFor='name' className={styles.label}>
                    レストラン名
                    <Field.RequiredIndicator />
                  </Field.Label>
                </Flex>
                <Input
                  id='name'
                  {...register('name', {
                    required: '店名は必須です',
                  })}
                  type='text'
                />
                <Field.ErrorText>
                  {errors.name?.message?.toString()}
                </Field.ErrorText>
              </Field.Root>
            </Flex>

            <Flex mb={8}>
              <Field.Root>
                <Flex mb={2}>
                  <Field.Label htmlFor='file' className={styles.label}>
                    レストランの写真
                  </Field.Label>
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
              </Field.Root>
            </Flex>

            <Flex mb={8}>
              <Genres errors={errors} control={control} />
            </Flex>

            <Field.Root>
              <Controller
                name='isOpen'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Flex alignItems='center' gap={4}>
                    <Text>{isEdit ? '営業停止' : '未営業'}</Text>
                    <Switch.Root
                      checked={value}
                      onCheckedChange={(e) => onChange(e.checked)}
                    >
                      <SwitchHiddenInput />
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch.Root>
                    <Text>{isEdit ? '営業中' : '営業開始'}</Text>
                  </Flex>
                )}
              />
            </Field.Root>
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
