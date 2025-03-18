import { useCallback, useState } from 'react';
import { DetailDrawerState, TOnOpenDetail } from '../index.d';

export type TUseDetailDrawer = () => {
  state: DetailDrawerState;
  handleOpen: TOnOpenDetail;
  handleClose: () => void;
};

export const useDetailDrawer: TUseDetailDrawer = () => {
  const [state, setState] = useState<DetailDrawerState>({
    menuId: undefined,
    open: false,
  });

  const handleOpen = useCallback(
    (menuId: string | undefined) => setState({ menuId, open: true }),
    []
  );

  const handleClose = useCallback(
    () => setState({ menuId: undefined, open: false }),
    []
  );

  return { state, handleOpen, handleClose };
};
