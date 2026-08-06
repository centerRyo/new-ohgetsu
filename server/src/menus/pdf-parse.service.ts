import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CONTACT_NOTE_PREFIX,
  CONTACT_SYMBOLS,
  CONTAINS_SYMBOLS,
  CellStatus,
  INGREDIENT_ALIASES,
  NON_ALLERGEN_HEADER_KEYWORDS,
} from './pdf-parse.constants';
import {
  ParsedCellDto,
  ParsedIngredientDto,
  ParsedMenuRowDto,
  ParsePdfResultDto,
} from './parse-pdf.dto';

/** PDFから抽出したテキスト片(x,yはページ左下原点の座標) */
export interface TextItem {
  x: number;
  y: number;
  str: string;
}

/** 復元した列ヘッダー */
interface Header {
  x: number;
  text: string;
}

// ── クラスタリングの許容差(px)。参考PDFの実測に基づく ──
/** 同一行とみなすY座標の許容差 */
const ROW_Y_TOLERANCE = 4;
/** 同一列とみなすX座標の許容差 */
const COLUMN_X_TOLERANCE = 6;

const CONTAINS_SET: ReadonlySet<string> = new Set(CONTAINS_SYMBOLS);
const CONTACT_SET: ReadonlySet<string> = new Set(CONTACT_SYMBOLS);

/**
 * セルの文字列からアレルゲン有無を判定する。
 * `○◎●〇◯`→contains, `△▲`→contact, それ以外(×/空など)→none。
 */
export function classifySymbol(str: string): CellStatus {
  const s = normalizeName(str);
  if (!s) return 'none';
  // 複数文字が混ざっても、含む/接触のシンボルが含まれていれば優先判定
  for (const ch of s) {
    if (CONTAINS_SET.has(ch)) return 'contains';
  }
  for (const ch of s) {
    if (CONTACT_SET.has(ch)) return 'contact';
  }
  return 'none';
}

/**
 * ヘッダー・セル文字列の正規化。空白/全角空白/改行/中点などのノイズを除去する。
 */
export function normalizeName(str: string): string {
  if (!str) return '';
  return str.replace(/[\s　\n\r\t・]/g, '').trim();
}

/**
 * 復元したヘッダー文字列をingredientマスタに照合する。
 * 完全一致 → 別名辞書 の順で試し、ヒットしなければnull。
 */
export function matchIngredient(
  headerText: string,
  ingredients: ParsedIngredientDto[]
): ParsedIngredientDto | null {
  const normalized = normalizeName(headerText);
  if (!normalized) return null;

  const direct = ingredients.find((i) => normalizeName(i.name) === normalized);
  if (direct) return direct;

  const aliasTarget = INGREDIENT_ALIASES[normalized];
  if (aliasTarget) {
    const viaAlias = ingredients.find(
      (i) => normalizeName(i.name) === normalizeName(aliasTarget)
    );
    if (viaAlias) return viaAlias;
  }

  // 前方一致(例: キウイ ↔ キウイフルーツ)。2文字以上のときのみ許可。
  if (normalized.length >= 2) {
    const prefix = ingredients.find((i) => {
      const n = normalizeName(i.name);
      return n.startsWith(normalized) || normalized.startsWith(n);
    });
    if (prefix) return prefix;
  }

  // 縦書き復元でかなの順序が乱れることがあるため、構成文字が一致(アナグラム)し、
  // かつ3文字以上の名前については同一ingredientとみなす(誤照合を避けるため長さ限定)。
  if (normalized.length >= 3) {
    const key = anagramKey(normalized);
    const anagram = ingredients.find(
      (i) => normalizeName(i.name).length >= 3 && anagramKey(i.name) === key
    );
    if (anagram) return anagram;
  }

  return null;
}

/** 文字を並べ替えても等しいか比較するための正規化キー(構成文字をソート) */
function anagramKey(str: string): string {
  return [...normalizeName(str)].sort().join('');
}

/**
 * 縦書き1文字ずつのヘッダーを、X座標でクラスタリングし各列をY降順で連結して復元する。
 */
export function reconstructHeaders(items: TextItem[]): Header[] {
  const columns = clusterByX(items);
  return columns.map((col) => ({
    x: average(col.map((c) => c.x)),
    // 上(y大)から下(y小)の順に連結
    text: [...col]
      .sort((a, b) => b.y - a.y)
      .map((c) => c.str)
      .join(''),
  }));
}

/**
 * △(接触の可能性)アレルゲン名から定型文noteを生成する。空なら undefined。
 */
export function buildContactNote(names: string[]): string | undefined {
  if (names.length === 0) return undefined;
  return CONTACT_NOTE_PREFIX + names.join(', ');
}

/**
 * 生のテキストアイテム群から表を再構築し、解析結果を組み立てる。
 * テキストが空/メニュー行0件など表として認識できない場合は422を投げる。
 */
export function buildTable(
  items: TextItem[],
  ingredients: ParsedIngredientDto[]
): ParsePdfResultDto {
  const meaningful = items.filter((i) => normalizeName(i.str).length > 0);
  if (meaningful.length === 0) {
    throw new UnprocessableEntityException(
      'テキスト埋め込みPDFのみ対応しています。画像ベース(スキャン)のPDFや表を認識できないPDFは読み取れません。'
    );
  }

  const rows = clusterRows(meaningful);
  if (rows.length < 2) {
    // ヘッダーのみ or データ無し
    throwUnparseable();
  }

  // ── ヘッダー帯とデータ行の分離 ──
  // データ行はアレルゲンシンボル(●△等)を複数含む。最上部(y最大)のシンボル行を
  // 「最初のデータ行」とし、それより上の全アイテムをヘッダー帯として縦書き連結する。
  const firstDataRowIndex = findFirstDataRowIndex(rows);
  if (firstDataRowIndex < 0) {
    throwUnparseable();
  }
  // ヘッダー帯 = 最初のデータ行のすぐ上に連続する行(縦書き見出し)のみ。
  // 凡例文やセクション見出しは大きなY間隔で離れているため、間隔が開いたら打ち切る。
  const headerRows = collectHeaderRows(rows, firstDataRowIndex);
  const headerItems = headerRows.flatMap((r) => r.items);
  const dataRows = rows.slice(firstDataRowIndex);

  const headers = reconstructHeaders(headerItems);

  // ── アレルゲン列の確定 ──
  // 各ヘッダー列をingredientに照合。栄養成分・商品名などのラベル列は対象外。
  const allergenColumns: {
    x: number;
    header: string;
    ingredient: ParsedIngredientDto | null;
  }[] = [];
  const unmatched: string[] = [];

  const sortedHeaders = [...headers].sort((a, b) => a.x - b.x);

  for (const h of sortedHeaders) {
    if (isNonAllergenHeader(h.text)) continue; // 商品名・栄養成分など
    const ingredient = matchIngredient(h.text, ingredients);
    if (ingredient) {
      allergenColumns.push({ x: h.x, header: h.text, ingredient });
    } else if (isPlausibleAllergenHeader(h.text)) {
      // 短い(=アイコン/略称の)未照合列のみ警告対象にする。
      // セクション見出しのような長いラベルはノイズなので無視。
      unmatched.push(h.text);
      allergenColumns.push({ x: h.x, header: h.text, ingredient: null });
    }
  }

  // 商品名の右端 = 最も左のアレルゲン列(照合済み含む)のX
  const leftmostAllergenX = allergenColumns.length
    ? Math.min(...allergenColumns.map((c) => c.x))
    : Infinity;
  // 商品名の左端 = データ行の最左テキストX(装飾ラベル列を含みうるので後段で除外)
  const nameColumnX = estimateNameColumnX(
    rows.slice(firstDataRowIndex),
    leftmostAllergenX
  );

  // ── データ行を1メニューとして組み立てる ──
  // メニューの実体は「アレルゲンシンボルを持つ行」。メニュー名は同じ行 or
  // すぐ上の折り返し行にあるため、隣接する名前専用行の名前も結合する。
  const symbolRows = dataRows.filter((r) => countSymbols(r) > 0);
  const nameOnlyRows = dataRows.filter((r) => countSymbols(r) === 0);

  const nameEndX = leftmostAllergenX; // 商品名の右端 = 最も左のアレルゲン列のX

  const menus: ParsedMenuRowDto[] = [];
  for (let idx = 0; idx < symbolRows.length; idx++) {
    const row = symbolRows[idx];
    const prevSymbolY = idx > 0 ? symbolRows[idx - 1].y : Infinity;

    // このシンボル行の名前 + (直前シンボル行との間にある)折り返し名前行を結合
    const nameParts = [extractRowName(row, nameColumnX, nameEndX)];
    for (const nr of nameOnlyRows) {
      if (nr.y > row.y && nr.y < prevSymbolY) {
        nameParts.push(extractRowName(nr, nameColumnX, nameEndX));
      }
    }
    const name = nameParts.filter(Boolean).join('').trim();
    if (!name) continue; // 名前が取れない行(装飾ラベルのみ等)はスキップ

    const cells: ParsedCellDto[] = [];
    const contactNames: string[] = [];

    for (const col of allergenColumns) {
      if (!col.ingredient) continue; // 未照合列はセルに含めない(警告のみ)
      const cellStr = valueAtColumn(row, col.x);
      const status = classifySymbol(cellStr);
      cells.push({
        ingredientId: col.ingredient.id,
        ingredientName: col.ingredient.name,
        status,
      });
      if (status === 'contact') contactNames.push(col.ingredient.name);
    }

    menus.push({ name, cells, note: buildContactNote(contactNames) });
  }

  if (menus.length === 0) {
    throwUnparseable();
  }

  return new ParsePdfResultDto({
    menus,
    ingredients,
    unmatchedColumns: unique(unmatched).map((headerText) => ({ headerText })),
  });
}

function throwUnparseable(): never {
  throw new UnprocessableEntityException(
    'PDFから表を認識できませんでした。テキスト埋め込みのアレルゲン表PDFをアップロードしてください。'
  );
}

/**
 * ページごとに抽出したテキスト片を解析し、全ページのメニューを結合して返す。
 *
 * PDFはページ間でY座標が重複するため、ページ単位でbuildTableを実行する。
 * 各ページはヘッダー(商品名/アレルゲン列)を繰り返し持つ想定。データの無い
 * ページ(解析失敗)は読み飛ばし、全ページで1件もメニューが取れなければ422を投げる。
 */
export function parsePages(
  pages: TextItem[][],
  ingredients: ParsedIngredientDto[]
): ParsePdfResultDto {
  const allMenus: ParsedMenuRowDto[] = [];
  const unmatchedSet = new Set<string>();
  let anySuccess = false;

  for (const pageItems of pages) {
    try {
      const result = buildTable(pageItems, ingredients);
      allMenus.push(...result.menus);
      result.unmatchedColumns.forEach((u) => unmatchedSet.add(u.headerText));
      anySuccess = true;
    } catch (e) {
      // 説明ページや空ページはスキップし、他ページの結果を活かす
      if (e instanceof UnprocessableEntityException) continue;
      throw e;
    }
  }

  if (!anySuccess || allMenus.length === 0) {
    throwUnparseable();
  }

  return new ParsePdfResultDto({
    menus: allMenus,
    ingredients,
    unmatchedColumns: [...unmatchedSet].map((headerText) => ({ headerText })),
  });
}

/** ヘッダーが栄養成分などアレルゲン以外の列か */
function isNonAllergenHeader(text: string): boolean {
  const n = normalizeName(text);
  return NON_ALLERGEN_HEADER_KEYWORDS.some((kw) =>
    n.includes(normalizeName(kw))
  );
}

/** ヘッダー行同士とみなす連続性の上限Y間隔 */
const HEADER_ROW_GAP = 11;

/**
 * 最初のデータ行のすぐ上に連続するヘッダー行(縦書き見出しの帯)を集める。
 * rowsはy降順。データ行の直上の行を必ずヘッダーの1行目とし、そこから上方向に
 * 行間隔がHEADER_ROW_GAP以内で連続する限り取り込む。凡例文やセクション見出しは
 * 大きなY間隔で離れているため打ち切られる。
 */
function collectHeaderRows(rows: Row[], firstDataRowIndex: number): Row[] {
  const first = firstDataRowIndex - 1;
  if (first < 0) return [];
  const result: Row[] = [rows[first]];
  for (let i = first - 1; i >= 0; i--) {
    const gap = rows[i].y - rows[i + 1].y;
    if (gap > HEADER_ROW_GAP) break;
    result.push(rows[i]);
  }
  return result;
}

/** 行に含まれるアレルゲンシンボル(●△等)の数 */
function countSymbols(row: Row): number {
  return row.items.filter((it) => {
    const st = classifySymbol(it.str);
    return st === 'contains' || st === 'contact';
  }).length;
}

/**
 * 最初のデータ行のindexを推定する。
 * データ行はアレルゲン列の数だけシンボルを含み、凡例文(「●印をつけています」等)より
 * 遥かに多い。全行の最大シンボル数の半分を閾値にすることで凡例行を除外する。
 * (最大シンボル数の半分か2の大きい方。少列テーブルでも動くよう下限は2)
 */
function findFirstDataRowIndex(rows: Row[]): number {
  const maxSymbols = Math.max(0, ...rows.map((r) => countSymbols(r)));
  const threshold = Math.max(2, maxSymbols * 0.5);
  for (let i = 0; i < rows.length; i++) {
    if (countSymbols(rows[i]) >= threshold) return i;
  }
  return -1;
}

/**
 * 未照合でも警告(unmatchedColumns)対象にすべき「アレルゲン列らしい」ヘッダーか。
 * アイコンのみ/略称など短いものを対象にし、セクション見出し・ページ番号・
 * 飲料情報などのノイズ(数字・記号・カッコを含む長い文字列)は除外する。
 */
function isPlausibleAllergenHeader(text: string): boolean {
  const n = normalizeName(text);
  if (n.length === 0 || n.length > 8) return false;
  // 数字・記号・カッコ・引用符などを含むものはアレルゲン名ではない
  if (/[0-9０-９()（）"”"'’、。,.／/ｍｌ]/.test(n)) return false;
  // かな/カナ/漢字/長音のみで構成されること
  return /^[ぁ-んァ-ヶ一-龠ーｰ]+$/.test(n);
}

/**
 * データ行から商品名列の開始X(左端)を推定する。
 *
 * PDFによっては商品名列のさらに左に縦書きの装飾カテゴリ見出し(季節商品 等)が
 * 単一文字で並ぶ。商品名は1トークンあたりの文字数が多いのに対し、装飾見出しは
 * 1文字ずつなので、アレルゲン列より左のテキストをX列にまとめ、
 * 「文字数合計が最大の列」を商品名列とみなしてそのXを返す。
 */
function estimateNameColumnX(dataRows: Row[], allergenStartX: number): number {
  const tokens = dataRows.flatMap((row) => leftTextTokens(row, allergenStartX));
  if (tokens.length === 0) return -Infinity;

  const columns = clusterByX(tokens);
  let best: { x: number; chars: number } | null = null;
  for (const col of columns) {
    const chars = col.reduce(
      (sum, it) => sum + normalizeName(it.str).length,
      0
    );
    const x = Math.min(...col.map((it) => it.x));
    if (!best || chars > best.chars) best = { x, chars };
  }
  return best ? best.x : -Infinity;
}

/**
 * 行から商品名を抽出する。商品名列の開始X以上・アレルゲン列開始X未満の範囲の
 * テキストを左から連結する(シンボル・数値のみのトークンは除外)。
 */
function extractRowName(
  row: Row,
  nameColumnX: number,
  nameEndX: number
): string {
  const names = row.items
    .filter((it) => it.x >= nameColumnX - COLUMN_X_TOLERANCE && it.x < nameEndX)
    .filter((it) => classifySymbol(it.str) === 'none') // シンボルは除外
    .filter((it) => !/^[0-9.．]+$/.test(normalizeName(it.str))) // 数値のみ除外
    .sort((a, b) => a.x - b.x)
    .map((it) => it.str.trim())
    .join('');
  return names.trim();
}

/** 行の左端テキストトークン(商品名列や装飾ラベルの候補)を返す */
function leftTextTokens(row: Row, allergenStartX: number): TextItem[] {
  return row.items
    .filter((it) => it.x < allergenStartX)
    .filter((it) => classifySymbol(it.str) === 'none')
    .filter((it) => !/^[0-9.．]+$/.test(normalizeName(it.str)));
}

/** 行の指定列X付近のセル値を取得する */
function valueAtColumn(row: Row, x: number): string {
  const hit = row.items.find((it) => Math.abs(it.x - x) <= COLUMN_X_TOLERANCE);
  return hit ? hit.str : '';
}

interface Row {
  y: number;
  items: TextItem[];
}

/** Y座標クラスタリングで行を構成する(Y降順=上から下) */
export function clusterRows(items: TextItem[]): Row[] {
  const sorted = [...items].sort((a, b) => b.y - a.y);
  const rows: Row[] = [];
  for (const it of sorted) {
    const row = rows.find((r) => Math.abs(r.y - it.y) <= ROW_Y_TOLERANCE);
    if (row) {
      row.items.push(it);
      row.y = (row.y * (row.items.length - 1) + it.y) / row.items.length;
    } else {
      rows.push({ y: it.y, items: [it] });
    }
  }
  return rows;
}

/** X座標クラスタリングで列(同一Xのアイテム集合)を構成する */
function clusterByX(items: TextItem[]): TextItem[][] {
  const sorted = [...items].sort((a, b) => a.x - b.x);
  const cols: { x: number; items: TextItem[] }[] = [];
  for (const it of sorted) {
    const col = cols.find((c) => Math.abs(c.x - it.x) <= COLUMN_X_TOLERANCE);
    if (col) {
      col.items.push(it);
      col.x = (col.x * (col.items.length - 1) + it.x) / col.items.length;
    } else {
      cols.push({ x: it.x, items: [it] });
    }
  }
  return cols.map((c) => c.items);
}

function average(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function unique(arr: string[]): string[] {
  return [...new Set(arr)];
}

/**
 * PDFアレルゲン表を解析してメニュー×アレルゲン情報を返すサービス。
 * pdfjs-dist でテキスト+座標を抽出し(副作用)、buildTable(純粋関数)で表を再構築する。
 */
@Injectable()
export class PdfParseService {
  constructor(private readonly prisma: PrismaService) {}

  async parsePdf(buffer: Buffer): Promise<ParsePdfResultDto> {
    const ingredients = await this.prisma.ingredients.findMany({
      select: { id: true, name: true },
    });
    const pages = await this.extractTextItemsByPage(buffer);
    return parsePages(pages, ingredients);
  }

  /**
   * pdfjsでページごとにテキスト片(x,y,str)を抽出する。
   * ページ間でY座標が重複するため、ページ単位で分けて表を再構築する必要がある。
   */
  private async extractTextItemsByPage(buffer: Buffer): Promise<TextItem[][]> {
    let doc;
    try {
      // legacyビルドはNode(CommonJS)向け。ワーカ不要でメモリ上で解析する。
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
      const data = new Uint8Array(buffer);
      doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
    } catch {
      throw new UnprocessableEntityException(
        'PDFの読み込みに失敗しました。壊れているか対応していない形式の可能性があります。'
      );
    }

    const pages: TextItem[][] = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      const items: TextItem[] = [];
      for (const it of content.items) {
        const str = (it.str ?? '').trim();
        if (!str) continue;
        items.push({ x: it.transform[4], y: it.transform[5], str });
      }
      pages.push(items);
    }
    return pages;
  }
}
