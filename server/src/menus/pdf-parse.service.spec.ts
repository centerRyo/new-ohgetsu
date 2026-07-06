import { UnprocessableEntityException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  buildContactNote,
  buildTable,
  classifySymbol,
  matchIngredient,
  normalizeName,
  reconstructHeaders,
  TextItem,
} from './pdf-parse.service';

// 照合に使うingredientマスタ(28種のうちテストで使う分)
const INGREDIENTS = [
  { id: 'id-egg', name: '卵' },
  { id: 'id-milk', name: '乳' },
  { id: 'id-wheat', name: '小麦' },
  { id: 'id-peanut', name: '落花生' },
  { id: 'id-shrimp', name: 'えび' },
  { id: 'id-crab', name: 'かに' },
  { id: 'id-cashew', name: 'カシューナッツ' },
  { id: 'id-macadamia', name: 'まつたけ' }, // ダミー(マカダミアはDBにない想定)
  { id: 'id-soy', name: '大豆' },
];

describe('classifySymbol', () => {
  it.each(['○', '◎', '●', '〇', '◯'])('「%s」はcontains', (s) => {
    expect(classifySymbol(s)).toBe('contains');
  });

  it.each(['△', '▲'])('「%s」はcontact', (s) => {
    expect(classifySymbol(s)).toBe('contact');
  });

  it.each(['×', '✕', 'ー', '-', '', ' '])('「%s」はnone', (s) => {
    expect(classifySymbol(s)).toBe('none');
  });
});

describe('normalizeName', () => {
  it('前後の空白・全角空白を除去する', () => {
    expect(normalizeName(' 落花生 ')).toBe('落花生');
    expect(normalizeName('　カシューナッツ　')).toBe('カシューナッツ');
  });

  it('改行や中点などのノイズを除去する', () => {
    expect(normalizeName('カ\nシ\nュ\nー\nナ\nッ\nツ')).toBe('カシューナッツ');
  });
});

describe('matchIngredient', () => {
  it('DB名と完全一致すれば照合できる', () => {
    expect(matchIngredient('卵', INGREDIENTS)?.id).toBe('id-egg');
  });

  it('別名辞書経由で照合できる(落花生↔ピーナッツ)', () => {
    expect(matchIngredient('ピーナッツ', INGREDIENTS)?.id).toBe('id-peanut');
  });

  it('別名辞書経由で照合できる(牛乳↔乳)', () => {
    expect(matchIngredient('牛乳', INGREDIENTS)?.id).toBe('id-milk');
  });

  it('縦書き連結後の文字列を正規化して照合できる', () => {
    expect(matchIngredient('カ シ ュ ー ナ ッ ツ', INGREDIENTS)?.id).toBe(
      'id-cashew'
    );
  });

  it('照合できない列はnullを返す', () => {
    expect(matchIngredient('エネルギー', INGREDIENTS)).toBeNull();
    expect(matchIngredient('存在しない食材', INGREDIENTS)).toBeNull();
  });
});

describe('reconstructHeaders', () => {
  it('縦書き1文字ずつのヘッダーをX列ごとにY降順で連結する', () => {
    // 「マカダミア」が縦に積まれ、「卵」は単独列
    const items: TextItem[] = [
      { x: 100, y: 418, str: 'マ' },
      { x: 100, y: 408, str: 'カ' },
      { x: 100, y: 402, str: 'ダ' },
      { x: 100, y: 396, str: 'ミ' },
      { x: 100, y: 390, str: 'ア' },
      { x: 200, y: 407, str: '卵' },
    ];
    const headers = reconstructHeaders(items);
    const byX = headers.sort((a, b) => a.x - b.x);
    expect(byX[0].text).toBe('マカダミア');
    expect(byX[1].text).toBe('卵');
  });
});

describe('buildContactNote', () => {
  it('△のアレルゲン名を定型文で列挙する', () => {
    expect(buildContactNote(['乳', 'えび', 'かに'])).toBe(
      '調理器具・製造ライン共有のため接触の可能性: 乳, えび, かに'
    );
  });

  it('△が無ければundefinedを返す', () => {
    expect(buildContactNote([])).toBeUndefined();
  });
});

describe('buildTable', () => {
  // 最小の疑似テーブル:
  //   ヘッダー行(y=410付近): 商品名 | 卵 | 乳 | エネルギー(栄養→除外)
  //   データ行1(y=390): カレー   | ●  | △ | 500
  //   データ行2(y=380): サラダ   | ×  | ● | 20
  const items: TextItem[] = [
    // header
    { x: 40, y: 410, str: '商品名' },
    { x: 100, y: 410, str: '卵' },
    { x: 130, y: 410, str: '乳' },
    { x: 200, y: 410, str: 'エネルギー' },
    // row1
    { x: 40, y: 390, str: 'カレー' },
    { x: 100, y: 390, str: '●' },
    { x: 130, y: 390, str: '△' },
    { x: 200, y: 390, str: '500' },
    // row2
    { x: 40, y: 380, str: 'サラダ' },
    { x: 100, y: 380, str: '×' },
    { x: 130, y: 380, str: '●' },
    { x: 200, y: 380, str: '20' },
  ];

  it('メニュー行とアレルゲン列を復元する', () => {
    const result = buildTable(items, INGREDIENTS);
    expect(result.menus.map((m) => m.name)).toEqual(['カレー', 'サラダ']);
  });

  it('栄養成分列は照合対象から除外する', () => {
    const result = buildTable(items, INGREDIENTS);
    const curry = result.menus.find((m) => m.name === 'カレー')!;
    // 卵・乳の2列のみ(エネルギーは除外)
    expect(curry.cells.map((c) => c.ingredientName).sort()).toEqual(
      ['乳', '卵'].sort()
    );
  });

  it('●はcontains、△はcontact、×はnoneに分類する', () => {
    const result = buildTable(items, INGREDIENTS);
    const curry = result.menus.find((m) => m.name === 'カレー')!;
    expect(curry.cells.find((c) => c.ingredientName === '卵')!.status).toBe(
      'contains'
    );
    expect(curry.cells.find((c) => c.ingredientName === '乳')!.status).toBe(
      'contact'
    );
    const salad = result.menus.find((m) => m.name === 'サラダ')!;
    expect(salad.cells.find((c) => c.ingredientName === '卵')!.status).toBe(
      'none'
    );
  });

  it('△セルからnote定型文を自動生成する', () => {
    const result = buildTable(items, INGREDIENTS);
    const curry = result.menus.find((m) => m.name === 'カレー')!;
    expect(curry.note).toBe('調理器具・製造ライン共有のため接触の可能性: 乳');
    const salad = result.menus.find((m) => m.name === 'サラダ')!;
    expect(salad.note).toBeUndefined();
  });

  it('照合できないヘッダー列はunmatchedColumnsに入れる', () => {
    const withUnknown: TextItem[] = [
      ...items,
      { x: 160, y: 410, str: '謎の成分' },
      { x: 160, y: 390, str: '●' },
      { x: 160, y: 380, str: '●' },
    ];
    const result = buildTable(withUnknown, INGREDIENTS);
    expect(
      result.unmatchedColumns.map((u) => u.headerText)
    ).toContain('謎の成分');
  });

  it('メニュー行が0件なら422(UnprocessableEntity)を投げる', () => {
    const headerOnly: TextItem[] = [
      { x: 40, y: 410, str: '商品名' },
      { x: 100, y: 410, str: '卵' },
    ];
    expect(() => buildTable(headerOnly, INGREDIENTS)).toThrow(
      UnprocessableEntityException
    );
  });

  it('テキストアイテムが空なら422(UnprocessableEntity)を投げる', () => {
    expect(() => buildTable([], INGREDIENTS)).toThrow(
      UnprocessableEntityException
    );
  });
});

// 実PDFを使った統合的検証(fixtureが読めない環境ではskip)
describe('parsePdf (実PDF)', () => {
  const pdfPath = path.resolve(
    __dirname,
    '../../../allergy-nutrition_value_6.pdf'
  );
  const exists = fs.existsSync(pdfPath);
  const maybe = exists ? it : it.skip;

  maybe('allergy-nutrition_value_6.pdf からメニューを解析できる', async () => {
    // 遅延importでpdfjsのロードコストをこのテストに限定
    const { PdfParseService } = await import('./pdf-parse.service');
    const service = new PdfParseService({
      ingredients: { findMany: async () => INGREDIENTS },
    } as any);
    const buffer = fs.readFileSync(pdfPath);
    const result = await service.parsePdf(buffer);
    expect(result.menus.length).toBeGreaterThan(0);
    // 「含む」判定が少なくとも1件はある
    const anyContains = result.menus.some((m) =>
      m.cells.some((c) => c.status === 'contains')
    );
    expect(anyContains).toBe(true);
  }, 30000);
});
