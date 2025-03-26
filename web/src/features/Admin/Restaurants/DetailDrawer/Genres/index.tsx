import {
  SelectContent,
  SelectItem,
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
import { FormValues } from '../../index.d';
import styles from '../index.module.scss';

type Props = {
  errors: FieldErrors<FormValues>;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  control: Control<FormValues, any>;
};

const Genres = ({ errors, control }: Props) => {
  const { data, isLoading } = useSWR('/genres', () =>
    api.genres.genresControllerFindAll()
  );
  const genres = data?.data || [];

  const options = createListCollection({
    items: useCustomOptions({
      items: genres,
      getLabel: (item) => item.name,
    }),
  });

  return (
    <Field.Root invalid={!!errors.genreId?.message}>
      <Flex alignItems='center' gap={4} mb={2}>
        <Field.Label htmlFor='genreId' className={styles.label}>
          ジャンル
        </Field.Label>
        <span className={styles.required}>必須</span>
      </Flex>
      <Skeleton loading={isLoading} asChild>
        <Controller
          control={control}
          name='genreId'
          rules={{ required: 'ジャンルは必須です' }}
          render={({ field }) => {
            console.log(field);
            return (
              <SelectRoot
                name={field.name}
                value={[field.value]}
                onValueChange={({ value }) => field.onChange(value)}
                collection={options}
                width='50%'
              >
                <SelectTrigger>
                  <SelectValueText placeholder='ジャンルを選択してください' />
                </SelectTrigger>
                <SelectContent>
                  {options.items.map((option) => (
                    <SelectItem key={option.key} item={option}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            );
          }}
        />
      </Skeleton>
      <Field.ErrorText>{errors.genreId?.message?.toString()}</Field.ErrorText>
    </Field.Root>
  );
};

export default Genres;
