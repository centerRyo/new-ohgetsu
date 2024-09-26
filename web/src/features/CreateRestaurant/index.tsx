import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Genres from './Genres';
import { useHandler } from './hooks';
import { FormValues, PreviewType } from './index.d';
import styles from './index.module.scss';

export const CreateRestaurant = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      name: '',
      pic: undefined,
      genre_id: '',
    },
  });

  const [preview, setPreview] = useState<PreviewType>({});

  const { handleSubmit: onSubmit, handleFileChange } = useHandler({
    preview,
    setPreview,
    reset,
  });

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex mb={6}>
          <FormControl isInvalid={!!errors.name?.message}>
            <Flex alignItems='center' gap={4} mb={2}>
              <FormLabel htmlFor='name' className={styles.label}>
                店名
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
        <Flex mb={6}>
          <FormControl>
            <Flex mb={2}>
              <FormLabel htmlFor='file' className={styles.label}>
                お店の写真
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
        <Flex mb={6}>
          <Genres errors={errors} register={register} />
        </Flex>

        <Flex justifyContent='flex-end'>
          <Button
            type='submit'
            colorScheme='green'
            isDisabled={!isValid}
            isLoading={isSubmitting}
          >
            登録する
          </Button>
        </Flex>
      </form>
    </div>
  );
};
