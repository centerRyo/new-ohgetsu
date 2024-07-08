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

const Genres = ({ errors, register }: Props) => {
  const { data, isLoading } = useSWR('/genres', () =>
    api.api.genresControllerFindAll()
  );
  const genres = data?.data || [];

  const options = useCustomOptions({
    items: genres,
    getLabel: (item) => item.name,
  });

  return (
    <FormControl isInvalid={!!errors.genre_id?.message}>
      <Flex alignItems='center' gap={4} mb={2}>
        <FormLabel htmlFor='genre_id' className={styles.label}>
          ジャンル
        </FormLabel>
        <span className={styles.required}>必須</span>
      </Flex>
      <Skeleton isLoaded={!isLoading}>
        <Select
          placeholder='ジャンルを選択してください'
          {...register('genre_id', { required: 'ジャンルは必須です' })}
        >
          {options.map((option) => (
            <option key={option.key} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Skeleton>
      <FormErrorMessage>
        {errors.genre_id?.message?.toString()}
      </FormErrorMessage>
    </FormControl>
  );
};

export default Genres;
