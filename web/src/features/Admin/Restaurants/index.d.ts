export type DetailDrawerState = {
  restaurantId: string | undefined;
  open: boolean;
};

export type TOnOpenDetail = (
  restaurantId?: DetailDrawerState['restaurantId'] | undefined
) => void;

export type FormValues = {
  name: string;
  pic?: FileList;
  genreId: string;
  isOpen: boolean;
};

export type PreviewType = {
  pic?: string;
};
