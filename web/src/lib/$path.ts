import type { OptionalQuery as OptionalQuery_gsgao6 } from '../app/menus/[id]/page';

const buildSuffix = (url?: {
  query?: Record<string, string>;
  hash?: string;
}) => {
  const query = url?.query;
  const hash = url?.hash;
  if (!query && !hash) return '';
  const search = query ? `?${new URLSearchParams(query)}` : '';
  return `${search}${hash ? `#${hash}` : ''}`;
};

export const pagesPath = {
  create_restaurant: {
    $url: (url?: { hash?: string }) => ({
      pathname: '/create-restaurant' as const,
      hash: url?.hash,
      path: `/create-restaurant${buildSuffix(url)}`,
    }),
  },
  menus: {
    _id: (id: string | number) => ({
      $url: (url?: { query?: OptionalQuery_gsgao6; hash?: string }) => ({
        pathname: '/menus/[id]' as const,
        query: { id, ...url?.query },
        hash: url?.hash,
        path: `/menus/${id}${buildSuffix(url)}`,
      }),
    }),
    $url: (url?: { hash?: string }) => ({
      pathname: '/menus' as const,
      hash: url?.hash,
      path: `/menus${buildSuffix(url)}`,
    }),
  },
  restaurants: {
    _id: (id: string | number) => ({
      $url: (url?: { hash?: string }) => ({
        pathname: '/restaurants/[id]' as const,
        query: { id },
        hash: url?.hash,
        path: `/restaurants/${id}${buildSuffix(url)}`,
      }),
    }),
    $url: (url?: { hash?: string }) => ({
      pathname: '/restaurants' as const,
      hash: url?.hash,
      path: `/restaurants${buildSuffix(url)}`,
    }),
  },
  $url: (url?: { hash?: string }) => ({
    pathname: '/' as const,
    hash: url?.hash,
    path: `/${buildSuffix(url)}`,
  }),
};

export type PagesPath = typeof pagesPath;
