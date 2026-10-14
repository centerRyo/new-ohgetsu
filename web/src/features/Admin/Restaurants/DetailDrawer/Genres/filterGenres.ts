// 検索用に文字列を正規化する(全角半角・大小文字・ひらがなカタカナの差を吸収)
export const normalize = (value: string): string =>
  value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

export const filterGenres = <T extends { name: string }>(
  genres: T[],
  query: string
): T[] => {
  const q = normalize(query);
  if (!q) return genres;
  return genres.filter((genre) => normalize(genre.name).includes(q));
};
