import { filterGenres, normalize } from './filterGenres';

const genres = [
  { id: '1', name: 'ラーメン' },
  { id: '2', name: '日本料理' },
  { id: '3', name: 'イタリアン' },
  { id: '4', name: 'Cafe' },
];

describe('normalize', () => {
  it('カタカナをひらがなに変換する', () => {
    expect(normalize('ラーメン')).toBe('らーめん');
  });

  it('全角英数字を半角にし小文字化する', () => {
    expect(normalize('ＣＡＦＥ１')).toBe('cafe1');
  });

  it('前後の空白を除去する', () => {
    expect(normalize('  日本料理　')).toBe('日本料理');
  });
});

describe('filterGenres', () => {
  it('空文字の場合は全件返す', () => {
    expect(filterGenres(genres, '')).toEqual(genres);
    expect(filterGenres(genres, '   ')).toEqual(genres);
  });

  it('部分一致で絞り込む', () => {
    expect(filterGenres(genres, '料理')).toEqual([genres[1]]);
  });

  it('ひらがな入力でカタカナのジャンルにヒットする', () => {
    expect(filterGenres(genres, 'らーめん')).toEqual([genres[0]]);
    expect(filterGenres(genres, 'いたりあ')).toEqual([genres[2]]);
  });

  it('大文字小文字・全角半角を区別しない', () => {
    expect(filterGenres(genres, 'ｃａｆｅ')).toEqual([genres[3]]);
    expect(filterGenres(genres, 'CAFE')).toEqual([genres[3]]);
  });

  it('該当がなければ空配列を返す', () => {
    expect(filterGenres(genres, 'ステーキ')).toEqual([]);
  });
});
