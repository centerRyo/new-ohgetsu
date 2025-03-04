import { Button, Field, Flex, Image, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useHandler } from './hooks';
import { FormValues, PreviewType } from './index.d';
import styles from './index.module.scss';
import Ingredients from './Ingredients';
import { Restaurants } from './Restaurants';

export const CreateMenus = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control,
    reset,
  } = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      restaurantId: '',
      menus: [{ name: '', ingredientIds: [], pic: undefined }],
    },
  });

  const { fields, append } = useFieldArray({ control, name: 'menus' });

  const [preview, setPreview] = useState<PreviewType>({});

  const {
    handleSubmit: onSubmit,
    handleChangeFile,
    handleAddMenu,
  } = useHandler({
    preview,
    setPreview,
    reset,
    append,
  });

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex mb={6}>
          <Restaurants errors={errors} control={control} />
        </Flex>
        {fields.map((field, index) => (
          <div key={field.id}>
            <Flex mb={6}>
              <Field.Root
                invalid={errors.menus && !!errors.menus[index]?.name?.message}
              >
                <Flex alignItems='center' gap={4} mb={2}>
                  <Field.Label className={styles.label} htmlFor='menu_name'>
                    メニュー
                  </Field.Label>
                  <span className={styles.required}>必須</span>
                </Flex>
                <Input
                  type='text'
                  {...register(`menus.${index}.name`, {
                    required: 'メニューは必須です',
                  })}
                />
                <Field.ErrorText>
                  {errors.menus &&
                    errors.menus[index]?.name?.message?.toString()}
                </Field.ErrorText>
              </Field.Root>
            </Flex>
            <Flex mb={6}>
              <Ingredients errors={errors} control={control} index={index} />
            </Flex>
            <Flex mb={8}>
              <Field.Root>
                <Flex mb={2}>
                  <Field.Label className={styles.label}>写真</Field.Label>
                </Flex>
                <Input
                  type='file'
                  {...register(`menus.${index}.pic`)}
                  accept='image/*'
                  onChange={handleChangeFile}
                />
                {/* @ts-ignore */}
                {preview[`menus.${index}.pic`] && (
                  <Image
                    // @ts-ignore
                    src={preview[`menus.${index}.pic`]}
                    alt='プレビュー画像'
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
          </div>
        ))}

        <Button onClick={handleAddMenu}>メニューを追加</Button>

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
