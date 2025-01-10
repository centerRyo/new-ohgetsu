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
    api.genres.genresControllerFindAll()
  );
  const genres = data?.data || [];

  const options = useCustomOptions({
    items: genres,
    getLabel: (item) => item.name,
  });

  return (
    <FormControl isInvalid={!!errors.genreId?.message}>
      <Flex alignItems='center' gap={4} mb={2}>
        <FormLabel htmlFor='genreId' className={styles.label}>
          ジャンル
        </FormLabel>
        <span className={styles.required}>必須</span>
      </Flex>
      <Skeleton isLoaded={!isLoading}>
        <Select
          placeholder='ジャンルを選択してください'
          {...register('genreId', { required: 'ジャンルは必須です' })}
        >
          {options.map((option) => (
            <option key={option.key} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Skeleton>
      <FormErrorMessage>{errors.genreId?.message?.toString()}</FormErrorMessage>
    </FormControl>
  );
};

export default Genres;
