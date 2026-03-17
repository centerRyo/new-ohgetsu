import { useCustomOptions } from '@/hooks/useOptions';
import { api } from '@/lib/swagger-client';
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  Flex,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import useSWR from 'swr';
import { FormValues } from '../../index.d';
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
        <label className={styles.label}>アレルギー情報</label>
      </Flex>
      {isLoading ? (
        <SkeletonText noOfLines={4} />
      ) : (
        <Controller
          name={`menus.${index}.ingredientIds`}
          control={control}
          render={({ field: { ref, value, onChange, onBlur, name } }) => (
            <CheckboxGroup
              value={Array.isArray(value) ? value : []}
              onValueChange={(value) => onChange(value)}
              name={name}
              onBlur={onBlur}
            >
              <Flex gap={4} wrap='wrap'>
                {options.map((option) => (
                  <CheckboxRoot value={option.value} key={option.key} ref={ref}>
                    <CheckboxHiddenInput />
                    <CheckboxControl>
                      <CheckboxIndicator />
                    </CheckboxControl>
                    <CheckboxLabel>{option.label}</CheckboxLabel>
                  </CheckboxRoot>
                ))}
              </Flex>
            </CheckboxGroup>
          )}
        />
      )}
      {errors.menus && errors.menus[index]?.ingredientIds?.message && (
        <Text color='red.500' fontSize='sm'>
          {errors.menus[index]?.ingredientIds?.message?.toString()}
        </Text>
      )}
    </div>
  );
};

export default Ingredients;
