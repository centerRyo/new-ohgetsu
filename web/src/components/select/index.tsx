import {
  Field,
  NativeSelectField,
  NativeSelectRoot,
} from '@chakra-ui/react';
import { memo } from 'react';

type Props = Partial<{
  isRequired: boolean;
  fontWeight: string;
  placeholder: string;
}> & {
  name: string;
  label: string;
  options: Array<{ id: number; value: string }>;
};

const Select = memo(
  ({
    name,
    label,
    options,
    isRequired,
    placeholder,
    fontWeight = 'bold',
  }: Props) => {
    return (
      <Field.Root required={isRequired}>
        <Field.Label fontWeight={fontWeight}>{label}</Field.Label>
        <NativeSelectRoot>
          <NativeSelectField name={name} placeholder={placeholder}>
            {options.map((option) => (
              <option key={option.id}>{option.value}</option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>
      </Field.Root>
    );
  }
);
Select.displayName = 'Select';

export default Select;
