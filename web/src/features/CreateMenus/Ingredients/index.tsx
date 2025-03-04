import { Checkbox } from '@/components/checkbox';
import { SkeletonText } from '@/components/skeleton';
import { useCustomOptions } from '@/hooks/useOptions';
import { api } from '@/lib/swagger-client';
import { CheckboxGroup, Field, Flex } from '@chakra-ui/react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import useSWR from 'swr';
import { FormValues } from '../index.d';
import styles from '../index.module.scss';

type Props = {
  errors: FieldErrors<FormValues>;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  control: Control<FormValues, any>;
  index: number;
};

const Ingredients = ({ errors, control, index }: Props) => {
  const { data, isLoading } = useSWR('/ingredients', () =>
    api.ingredients.ingredientsControllerFindAll()
  );
  const ingredients = data?.data || [];

  const options = useCustomOptions({
    items: ingredients,
    getLabel: (item) => item.name,
    ignoreDefault: true,
  });

  return (
    <div>
      <Flex mb={2}>
        <Field.Label className={styles.label}>アレルギー情報</Field.Label>
      </Flex>
      <SkeletonText loading={!isLoading} height={4} gap='5'>
        <Controller
          name={`menus.${index}.ingredientIds`}
          control={control}
          render={({ field: { ref, ...rest } }) => (
            // @ts-ignore
            <CheckboxGroup {...rest}>
              <Flex gap={4} wrap='wrap'>
                {options.map((option) => (
                  <Checkbox value={option.value} key={option.key} ref={ref}>
                    {option.label}
                  </Checkbox>
                ))}
              </Flex>
            </CheckboxGroup>
          )}
        />
      </SkeletonText>
      <Field.ErrorText>
        {errors.menus &&
          errors.menus[index]?.ingredientIds?.message?.toString()}
      </Field.ErrorText>
    </div>
  );
};

export default Ingredients;
