import { ParsedIngredientDto, UnmatchedColumnDto } from '@/types/generated/Api';
import { EditableMenuRow } from './convert';

/** 解析結果を編集可能な状態で保持するステート */
export type PdfImportState = {
  rows: EditableMenuRow[];
  ingredients: ParsedIngredientDto[];
  unmatchedColumns: UnmatchedColumnDto[];
};
