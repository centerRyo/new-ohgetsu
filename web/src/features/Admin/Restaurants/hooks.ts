import { useCallback, useState } from 'react';
import { DetailDrawerState, TOnOpenDetail } from './index.d';

export type TUseDetailDrawer = () => {
  state: DetailDrawerState;
  handleOpen: TOnOpenDetail;
  handleClose: () => void;
};

export const useDetailDrawer: TUseDetailDrawer = () => {
  const [state, setState] = useState<DetailDrawerState>({
    restaurantId: undefined,
    open: false,
  });

  const handleOpen = useCallback(
    (restaurantId: string | undefined) =>
      setState({ restaurantId, open: true }),
    []
  );

  const handleClose = useCallback(
    () => setState({ restaurantId: undefined, open: false }),
    []
  );

  return { state, handleOpen, handleClose };
};
