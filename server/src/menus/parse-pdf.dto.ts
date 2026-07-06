import { ApiProperty } from '@nestjs/swagger';
import { CellStatus } from './pdf-parse.constants';

/**
 * POST /menus/parse-pdf のリクエスト(multipart/form-data)。
 */
export class ParsePdfDto {
  /** アレルゲン表PDF */
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

/**
 * 解析されたセル1つ分(メニュー × アレルゲン)。
 */
export class ParsedCellDto {
  /** 照合できたingredientのID(未照合の列由来なら未設定) */
  @ApiProperty({ required: false })
  ingredientId?: string;

  /** アレルゲン名(ヘッダーから復元した表示名) */
  @ApiProperty()
  ingredientName: string;

  /** 判定結果: 含む / 接触の可能性 / なし */
  @ApiProperty({ enum: ['contains', 'contact', 'none'] })
  status: CellStatus;
}

/**
 * 解析されたメニュー1行分。
 */
export class ParsedMenuRowDto {
  /** メニュー名 */
  @ApiProperty()
  name: string;

  /** 照合済みアレルゲンのセル一覧 */
  @ApiProperty({ type: [ParsedCellDto] })
  cells: ParsedCellDto[];

  /** △(接触の可能性)から自動生成した定型文note */
  @ApiProperty({ required: false })
  note?: string;
}

/**
 * ヘッダーは復元できたがingredientに照合できなかった列(UI警告用)。
 */
export class UnmatchedColumnDto {
  /** 復元したヘッダー文字列 */
  @ApiProperty()
  headerText: string;
}

/**
 * 照合に利用したingredientマスタの一部(フロントのトグル表示用)。
 */
export class ParsedIngredientDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

/**
 * POST /menus/parse-pdf のレスポンス。
 */
export class ParsePdfResultDto {
  /** 解析されたメニュー行 */
  @ApiProperty({ type: [ParsedMenuRowDto] })
  menus: ParsedMenuRowDto[];

  /** 照合に使ったingredientマスタ */
  @ApiProperty({ type: [ParsedIngredientDto] })
  ingredients: ParsedIngredientDto[];

  /** 照合できなかった列(オレンジ警告表示用) */
  @ApiProperty({ type: [UnmatchedColumnDto] })
  unmatchedColumns: UnmatchedColumnDto[];

  constructor(partial: Partial<ParsePdfResultDto>) {
    Object.assign(this, partial);
  }
}
