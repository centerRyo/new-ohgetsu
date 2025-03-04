import { Button, Field, Flex, Image, Input } from '@chakra-ui/react';
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
    control,
  } = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      name: '',
      pic: undefined,
      genreId: '',
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
          <Field.Root invalid={!!errors.name?.message}>
            <Flex alignItems='center' gap={4} mb={2}>
              <Field.Label htmlFor='name' className={styles.label}>
                店名
              </Field.Label>
              <span className={styles.required}>必須</span>
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
        <Flex mb={6}>
          <Field.Root>
            <Flex mb={2}>
              <Field.Label htmlFor='file' className={styles.label}>
                お店の写真
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
        <Flex mb={6}>
          <Genres errors={errors} control={control} />
        </Flex>

        <Flex justifyContent='flex-end'>
          <Button
            type='submit'
            colorScheme='green'
            disabled={!isValid}
            loading={isSubmitting}
          >
            登録する
          </Button>
        </Flex>
      </form>
    </div>
  );
};
