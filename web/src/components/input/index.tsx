import { Input as ChakraInput, Field } from '@chakra-ui/react';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

type Props = ComponentPropsWithoutRef<'input'> &
  Partial<{
    isRequired: boolean;
    helper: string;
    fontWeight: string;
  }> & {
    label: string;
  };

const Input = forwardRef<HTMLInputElement, Props>(
  ({ isRequired, helper, fontWeight, label, type, name }, ref) => {
    return (
      <Field.Root required={isRequired}>
        <Field.Label fontWeight={fontWeight}>{label}</Field.Label>
        <ChakraInput id={name} name={name} type={type} ref={ref} />
        {helper && <Field.HelperText>{helper}</Field.HelperText>}
      </Field.Root>
    );
  }
);
Input.displayName = 'Input';

export default Input;
