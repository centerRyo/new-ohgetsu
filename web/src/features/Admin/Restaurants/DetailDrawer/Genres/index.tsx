import { api } from '@/lib/swagger-client';
import {
  Combobox,
  createListCollection,
  Field,
  Flex,
  Input,
  Portal,
  Skeleton,
} from '@chakra-ui/react';
import { ComponentProps, forwardRef, useMemo, useState } from 'react';
import { Control, Controller, FieldErrors, useWatch } from 'react-hook-form';
import useSWR from 'swr';
import { FormValues } from '../../index.d';
import styles from '../index.module.scss';
import { filterGenres } from './filterGenres';

type Props = {
  errors: FieldErrors<FormValues>;
  control: Control<FormValues>;
};

// Comboboxが渡す defaultValue を取り除き、value による制御のみにする
const ControlledInput = forwardRef<
  HTMLInputElement,
  ComponentProps<typeof Input>
>(function ControlledInput(props, ref) {
  const rest = { ...props };
  delete rest.defaultValue;
  return <Input ref={ref} {...rest} />;
});

const Genres = ({ errors, control }: Props) => {
  const { data, isLoading } = useSWR('/genres', () =>
    api.genres.genresControllerFindAll()
  );
  const genres = useMemo(() => data?.data ?? [], [data]);
  const [query, setQuery] = useState('');
  // 入力欄の表示値。Comboboxに任せると、入力途中の文字列がDOMに残り
  // 選択・クリア後も書き換わらないため、こちらで値を持ちinputに直接渡す
  const [inputValue, setInputValue] = useState('');
  const genreId = useWatch({ control, name: 'genreId' });

  // 選択中のジャンル(初期値・選択・クリア・リセット)に入力欄の表示を合わせる
  const [syncedKey, setSyncedKey] = useState<string | null>(null);
  const syncKey = genres.length ? genreId : null;
  if (syncKey !== null && syncKey !== syncedKey) {
    setSyncedKey(syncKey);
    setInputValue(genres.find((genre) => genre.id === genreId)?.name ?? '');
    setQuery('');
  }

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
              onInputValueChange={(e) => {
                setInputValue(e.inputValue);
                // 選択・クリア時は絞り込みを解除し、全件から選び直せるようにする
                setQuery(e.reason === 'input-change' ? e.inputValue : '');
              }}
              openOnClick
              allowCustomValue={false}
              width='100%'
            >
              <Combobox.Control>
                {/* defaultValue と value の併用を避けるため asChild で差し替える */}
                <Combobox.Input asChild>
                  <ControlledInput
                    id='genreId'
                    value={inputValue}
                    placeholder='ジャンルを入力・選択してください'
                    onBlur={onBlur}
                  />
                </Combobox.Input>
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
