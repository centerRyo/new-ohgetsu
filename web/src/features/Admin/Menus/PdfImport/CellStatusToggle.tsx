'use client';

import {
  SegmentGroupIndicator,
  SegmentGroupItems,
  SegmentGroupRoot,
} from '@chakra-ui/react';

type CellStatus = 'contains' | 'contact' | 'none';

type Props = {
  value: CellStatus;
  onChange: (status: CellStatus) => void;
};

const OPTIONS: { value: CellStatus; label: string }[] = [
  { value: 'contains', label: '含む' },
  { value: 'contact', label: '接触' },
  { value: 'none', label: 'なし' },
];

/** セルの3状態(含む/接触の可能性/なし)を切り替えるトグル */
export const CellStatusToggle = ({ value, onChange }: Props) => (
  <SegmentGroupRoot
    size='xs'
    value={value}
    onValueChange={(e) => {
      if (e.value) onChange(e.value as CellStatus);
    }}
  >
    <SegmentGroupIndicator />
    <SegmentGroupItems
      items={OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
    />
  </SegmentGroupRoot>
);
