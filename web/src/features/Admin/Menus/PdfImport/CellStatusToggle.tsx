'use client';

import { Button, ButtonGroup } from '@chakra-ui/react';

type CellStatus = 'contains' | 'contact' | 'none';

type Props = {
  value: CellStatus;
  onChange: (status: CellStatus) => void;
};

const OPTIONS: {
  value: CellStatus;
  label: string;
  colorPalette: string;
}[] = [
  { value: 'contains', label: '含む', colorPalette: 'red' },
  { value: 'contact', label: '接触', colorPalette: 'orange' },
  { value: 'none', label: 'なし', colorPalette: 'gray' },
];

/** セルの3状態(含む/接触の可能性/なし)を切り替えるトグル */
export const CellStatusToggle = ({ value, onChange }: Props) => (
  <ButtonGroup size='xs' attached>
    {OPTIONS.map((option) => {
      const selected = option.value === value;
      return (
        <Button
          key={option.value}
          type='button'
          colorPalette={option.colorPalette}
          variant={selected ? 'solid' : 'outline'}
          fontWeight={selected ? 'bold' : 'normal'}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      );
    })}
  </ButtonGroup>
);
