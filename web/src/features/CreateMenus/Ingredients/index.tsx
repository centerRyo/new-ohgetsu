import { useCustomOptions } from '@/hooks/useOptions';
import { api } from '@/lib/swagger-client';
import {
  Checkbox,
  CheckboxGroup,
  Flex,
  FormErrorMessage,
  FormLabel,
  SkeletonText,
} from '@chakra-ui/react';
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
        <FormLabel className={styles.label}>アレルギー情報</FormLabel>
      </Flex>
      <SkeletonText isLoaded={!isLoading} skeletonHeight={4} spacing='5'>
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
      <FormErrorMessage>
        {errors.menus &&
          errors.menus[index]?.ingredientIds?.message?.toString()}
      </FormErrorMessage>
    </div>
  );
};

export default Ingredients;
