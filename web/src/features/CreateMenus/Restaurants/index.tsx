import {
  SelectContent,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/select';
import { Skeleton } from '@/components/skeleton';
import { useCustomOptions } from '@/hooks/useOptions';
import { api } from '@/lib/swagger-client';
import { createListCollection, Field, Flex } from '@chakra-ui/react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import useSWR from 'swr';
import { FormValues } from '../index.d';
import styles from '../index.module.scss';

type Props = {
  errors: FieldErrors<FormValues>;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  control: Control<FormValues, any>;
};

export const Restaurants = ({ errors, control }: Props) => {
  const { data, isLoading } = useSWR('/restaurants', () =>
    api.restaurants.restaurantsControllerFind()
  );

  const restaurants = data?.data || [];

  const options = createListCollection({
    items: useCustomOptions({
      items: restaurants,
      getLabel: (item) => item.name,
      getKey: (item) => item.id,
    }),
  });

  return (
    <Field.Root invalid={!!errors.restaurantId?.message}>
      <Flex alignItems='center' gap={4} mb={2}>
        <Field.Label htmlFor='restaurantId' className={styles.label}>
          レストラン
        </Field.Label>
        <span className={styles.required}>必須</span>
      </Flex>
      <Skeleton loading={!isLoading}>
        <Controller
          control={control}
          name='restaurantId'
          rules={{ required: 'レストランは必須です' }}
          render={({ field }) => (
            <SelectRoot
              name={field.name}
              value={[field.value]}
              onValueChange={({ value }) => field.onChange(value)}
              collection={options}
            >
              <SelectTrigger>
                <SelectValueText placeholder='レストランを選択してください' />
              </SelectTrigger>
              <SelectContent>
                {options.items.map((option) => (
                  <option key={option.key} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectContent>
            </SelectRoot>
          )}
        />
      </Skeleton>
      <Field.ErrorText>
        {errors.restaurantId?.message?.toString()}
      </Field.ErrorText>
    </Field.Root>
  );
};
