import type { OptionalQuery as OptionalQuery_gsgao6 } from '../app/menus/[id]/page';
import type { OptionalQuery as OptionalQuery_qbbltk } from '../app/menus/page';
import type { OptionalQuery as OptionalQuery_1rgxedo } from '../app/restaurants/page';

const buildSuffix = (url?: {
  query?: Record<
    string,
    string | number | boolean | Array<string | number | boolean>
  >;
  hash?: string;
}) => {
  const query = url?.query;
  const hash = url?.hash;
  if (!query && !hash) return '';
  const search = (() => {
    if (!query) return '';

    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, String(item)));
      } else {
        params.set(key, String(value));
      }
    });

    return `?${params.toString()}`;
  })();
  return `${search}${hash ? `#${hash}` : ''}`;
};

export const pagesPath = {
  admin: {
    restaurants: {
      _id: (id: string | number) => ({
        menus: {
          $url: (url?: { hash?: string }) => ({
            pathname: '/admin/restaurants/[id]/menus' as const,
            query: { id },
            hash: url?.hash,
            path: `/admin/restaurants/${id}/menus${buildSuffix(url)}`,
          }),
        },
      }),
      $url: (url?: { hash?: string }) => ({
        pathname: '/admin/restaurants' as const,
        hash: url?.hash,
        path: `/admin/restaurants${buildSuffix(url)}`,
      }),
    },
  },
  create_menus: {
    $url: (url?: { hash?: string }) => ({
      pathname: '/create-menus' as const,
      hash: url?.hash,
      path: `/create-menus${buildSuffix(url)}`,
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
    $url: (url?: { query?: OptionalQuery_qbbltk; hash?: string }) => ({
      pathname: '/menus' as const,
      query: url?.query,
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
    $url: (url?: { query?: OptionalQuery_1rgxedo; hash?: string }) => ({
      pathname: '/restaurants' as const,
      query: url?.query,
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
