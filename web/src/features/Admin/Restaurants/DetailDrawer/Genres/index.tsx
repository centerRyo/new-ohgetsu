import { api } from '@/lib/swagger-client';
import {
  Combobox,
  createListCollection,
  Field,
  Flex,
  Portal,
  Skeleton,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import useSWR from 'swr';
import { FormValues } from '../../index.d';
import styles from '../index.module.scss';
import { filterGenres } from './filterGenres';

type Props = {
  errors: FieldErrors<FormValues>;
  control: Control<FormValues>;
};

const Genres = ({ errors, control }: Props) => {
  const { data, isLoading } = useSWR('/genres', () =>
    api.genres.genresControllerFindAll()
  );
  const genres = useMemo(() => data?.data ?? [], [data]);
  const [query, setQuery] = useState('');

  // 入力中の文字列で候補を絞り込む
  const collection = useMemo(
    () =>
      createListCollection({
        items: filterGenres(genres, query),
        itemToString: (item) => item.name,
        itemToValue: (item) => item.id,
      }),
    [genres, query]
  );

  return (
    <Field.Root invalid={!!errors.genreId?.message}>
      <Flex alignItems='center' gap={4} mb={2}>
        <Field.Label htmlFor='genreId' className={styles.label}>
          ジャンル
        </Field.Label>
        <span className={styles.required}>必須</span>
      </Flex>
      {isLoading ? (
        <Skeleton height='40px' />
      ) : (
        <Controller
          name='genreId'
          control={control}
          rules={{ required: 'ジャンルは必須です' }}
          render={({ field: { value, onChange, onBlur } }) => (
            <Combobox.Root
              collection={collection}
              value={value ? [value] : []}
              onValueChange={(e) => onChange(e.value[0] ?? '')}
              onInputValueChange={(e) =>
                // 選択・クリア時は絞り込みを解除し、全件から選び直せるようにする
                setQuery(e.reason === 'input-change' ? e.inputValue : '')
              }
              openOnClick
              allowCustomValue={false}
              width='100%'
            >
              <Combobox.Control>
                <Combobox.Input
                  id='genreId'
                  placeholder='ジャンルを入力・選択してください'
                  onBlur={onBlur}
                />
                <Combobox.IndicatorGroup>
                  <Combobox.ClearTrigger />
                  <Combobox.Trigger />
                </Combobox.IndicatorGroup>
              </Combobox.Control>
              <Portal>
                <Combobox.Positioner>
                  <Combobox.Content>
                    <Combobox.Empty>
                      該当するジャンルがありません
                    </Combobox.Empty>
                    {collection.items.map((item) => (
                      <Combobox.Item item={item} key={item.id}>
                        {item.name}
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    ))}
                  </Combobox.Content>
                </Combobox.Positioner>
              </Portal>
            </Combobox.Root>
          )}
        />
      )}
      <Field.ErrorText>{errors.genreId?.message?.toString()}</Field.ErrorText>
    </Field.Root>
  );
};

export default Genres;
