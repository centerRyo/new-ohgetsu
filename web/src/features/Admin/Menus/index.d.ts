export type DetailDrawerState = {
  menuId: string | undefined;
  open: boolean;
};

export type TOnOpenDetail = (
  menuId?: DetailDrawerState['menuId'] | undefined
) => void;

export type FormValues = {
  menus: Array<{
    name: string;
    ingredientIds: Array<string>;
    pic?: FileList;
    note?: string;
  }>;
};

// TODO: メニュー写真の型を動的につける
export type PreviewType = {
  'menus.0.pic'?: string;
};
