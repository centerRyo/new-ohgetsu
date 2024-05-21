const buildSuffix = (url?: {query?: Record<string, string>, hash?: string}) => {
  const query = url?.query;
  const hash = url?.hash;
  if (!query && !hash) return '';
  const search = query ? `?${new URLSearchParams(query)}` : '';
  return `${search}${hash ? `#${hash}` : ''}`;
};

export const pagesPath = {
  "shops": {
    _id: (id: string | number) => ({
      $url: (url?: { hash?: string }) => ({ pathname: '/shops/[id]' as const, query: { id }, hash: url?.hash, path: `/shops/${id}${buildSuffix(url)}` })
    }),
    $url: (url?: { hash?: string }) => ({ pathname: '/shops' as const, hash: url?.hash, path: `/shops${buildSuffix(url)}` })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash, path: `/${buildSuffix(url)}` })
};

export type PagesPath = typeof pagesPath;
