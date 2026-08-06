import { CreateMenuDto, ParsedMenuRowDto } from '@/types/generated/Api';

/**
 * 確認テーブルの1行(編集後の状態)。
 * ParsedMenuRowDto を編集可能にしたフロント用の型。
 */
export type EditableMenuRow = ParsedMenuRowDto;

/**
 * 確認テーブルの状態を POST /menus のリクエスト(CreateMenuDto)に変換する。
 *
 * - status === 'contains' のアレルゲンのみ ingredientIds に含める
 *   (△=contact は「含まない」扱いで、理由は note 側に残す)
 * - ingredientId を持たない(未照合の)セルは無視する
 * - note はそのまま引き継ぐ(空文字は undefined に正規化)
 * - 名前が空の行は登録対象から除外する
 */
export const toCreateMenuDto = (
  restaurantId: string,
  rows: EditableMenuRow[]
): CreateMenuDto => {
  const menus = rows
    .filter((row) => row.name.trim().length > 0)
    .map((row) => {
      const ingredientIds = row.cells
        .filter((cell) => cell.status === 'contains' && !!cell.ingredientId)
        .map((cell) => cell.ingredientId as string);

      const note = row.note?.trim() ? row.note.trim() : undefined;

      return {
        name: row.name.trim(),
        ingredientIds,
        note,
      };
    });

  return { restaurantId, menus };
};
