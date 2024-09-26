import { useCustomOptions } from '@/hooks/useOptions';
import { api } from '@/lib/swagger-client';
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  Skeleton,
} from '@chakra-ui/react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import useSWR from 'swr';
import { FormValues } from '../index.d';
import styles from '../index.module.scss';

type Props = {
  errors: FieldErrors<FormValues>;
  register: UseFormRegister<FormValues>;
};

export const Restaurants = ({ errors, register }: Props) => {
  const { data, isLoading } = useSWR('/restaurants', () =>
    api.restaurants.restaurantsControllerFindAll()
  );

  const restaurants = data?.data || [];

  const options = useCustomOptions({
    items: restaurants,
    getLabel: (item) => item.name,
  });

  return (
    <FormControl isInvalid={!!errors.restaurantId?.message}>
      <Flex alignItems='center' gap={4} mb={2}>
        <FormLabel htmlFor='restaurantId' className={styles.label}>
          レストラン
        </FormLabel>
        <span className={styles.required}>必須</span>
      </Flex>
      <Skeleton isLoaded={!isLoading}>
        <Select
          placeholder='レストランを選択してください'
          {...register('restaurantId', { required: 'レストランは必須です' })}
        >
          {options.map((option) => (
            <option key={option.key} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Skeleton>
      <FormErrorMessage>
        {errors.restaurantId?.message?.toString()}
      </FormErrorMessage>
    </FormControl>
  );
};
