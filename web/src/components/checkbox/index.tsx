import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  Field,
  Flex,
  SkeletonText,
} from '@chakra-ui/react';
import { memo } from 'react';

type Props = Partial<{
  isRequired: boolean;
  fontWeight: string;
  isLoading: boolean;
  isDisabled: boolean;
  testPrefix: string;
}> & {
  options: Array<{ label: string; value: string }>;
  name: string;
  label: string;
};

const CheckboxComponent = memo(
  ({
    name,
    label,
    isRequired,
    testPrefix,
    fontWeight = 'bold',
    isLoading,
    isDisabled,
    options,
  }: Props) => {
    return (
      <Field.Root required={isRequired}>
        <Field.Label fontWeight={fontWeight}>{label}</Field.Label>
        {isLoading ? (
          <SkeletonText
            data-testid={testPrefix ? `${testPrefix}-${name}` : name}
            noOfLines={3}
          />
        ) : (
          <CheckboxGroup>
            <Flex gap={4} wrap='wrap'>
              {options.map((option) => (
                <CheckboxRoot
                  key={option.value}
                  disabled={isDisabled}
                  name={option.value}
                >
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
      </Field.Root>
    );
  }
);
CheckboxComponent.displayName = 'Checkbox';

export default CheckboxComponent;
