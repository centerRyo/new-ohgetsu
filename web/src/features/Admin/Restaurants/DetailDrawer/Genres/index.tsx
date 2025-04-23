import { useCustomOptions } from '@/hooks/useOptions';
import { api } from '@/lib/swagger-client';
import {
  createListCollection,
  Field,
  Flex,
  Portal,
  Select,
} from '@chakra-ui/react';
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
    <Field.Root invalid={!!errors.genreId?.message} required>
      <Flex alignItems='center' gap={4} mb={2}>
        <Field.Label htmlFor='genreId' className={styles.label}>
          ジャンル
          <Field.RequiredIndicator />
        </Field.Label>
      </Flex>
      {/* FIXME: セレクトボックスを押しても選択肢が表示されない */}
      <Controller
        control={control}
        name='genreId'
        rules={{ required: 'ジャンルは必須です' }}
        render={({ field: { value, onChange, onBlur } }) => (
          <Select.Root
            name='genreId'
            value={value ? [value] : []}
            onValueChange={({ value }) => onChange(value)}
            onInteractOutside={() => onBlur()}
            collection={options}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder='ジャンルを選択してください' />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {options.items.map((option) => (
                    <Select.Item item={option} key={option.value}>
                      {option.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        )}
      />
      <Field.ErrorText>{errors.genreId?.message?.toString()}</Field.ErrorText>
    </Field.Root>
  );
};

export default Genres;
