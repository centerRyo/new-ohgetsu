export type FormValues = {
  restaurantId: string;
  menus: Array<{
    name: string;
    ingredientIds: Array<string>;
    pic?: FileList;
  }>;
};

// TODO: メニュー写真の型を動的につける
export type PreviewType = {
  pic?: string;
  'menus.0.pic'?: string;
};
