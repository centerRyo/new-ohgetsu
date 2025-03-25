/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface IngredientDto {
  id: string;
  name: string;
  pic: string;
}

export interface GenreDto {
  id: string;
  name: string;
}

export interface RestaurantDto {
  /** レストランID */
  id: string;
  /** レストラン名 */
  name: string;
  /** レストランの画像URL */
  pic: string;
  /** ジャンル */
  genre: GenreDto;
  /**
   * 営業停止日時
   * @format date-time
   */
  deletedAt: Date;
}

export interface CreateRestaurantDto {
  /** レストラン名 */
  name: string;
  /**
   * 写真
   * @format binary
   */
  pic?: File;
  /** ジャンルID */
  genreId: string;
  /** 営業開始フラグ */
  isOpen: boolean;
}

export interface UpdateRestaurantDto {
  /** レストラン名 */
  name?: string;
  /**
   * 写真
   * @format binary
   */
  pic?: File;
  /** ジャンルID */
  genreId?: string;
  /** 営業開始フラグ */
  isOpen?: boolean;
}

export interface MenuDto {
  id: string;
  name: string;
  pic: string;
  ingredients: IngredientDto[];
}

export interface PartialMenuDto {
  name: string;
  /**
   * 写真
   * @format byte
   */
  pic?: string;
  ingredientIds: string[];
}

export interface CreateMenuDto {
  restaurantId: string;
  menus: PartialMenuDto[];
}

export interface UpdateMenuDto {
  name: string;
  /**
   * 写真
   * @format binary
   */
  pic?: File;
  ingredientIds: string[];
}

export interface DeleteMenuDto {
  result: boolean;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => 'undefined' !== typeof query[key]
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string'
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { 'Content-Type': type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === 'undefined' || body === null
            ? null
            : payloadFormatter(body),
      }
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title ohgetsu API
 * @version 1.0
 * @contact
 *
 * ohgetsu API description
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  ingredients = {
    /**
     * No description
     *
     * @tags ingredients
     * @name IngredientsControllerFindAll
     * @summary 原材料を取得する
     * @request GET:/ingredients
     */
    ingredientsControllerFindAll: (params: RequestParams = {}) =>
      this.request<IngredientDto[], any>({
        path: `/ingredients`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  genres = {
    /**
     * No description
     *
     * @tags genres
     * @name GenresControllerFindAll
     * @summary ジャンルを取得する
     * @request GET:/genres
     */
    genresControllerFindAll: (params: RequestParams = {}) =>
      this.request<GenreDto[], any>({
        path: `/genres`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  restaurants = {
    /**
     * @description 検索キーワードがある場合、レストラン名で部分一致検索を行う。ない場合は全件取得する
     *
     * @tags restaurants
     * @name RestaurantsControllerFind
     * @summary レストラン一覧を取得する
     * @request GET:/restaurants
     */
    restaurantsControllerFind: (
      query?: {
        /** 検索キーワード */
        search_query?: string;
        /** 営業停止中も含むかどうか */
        withDeleted?: boolean;
      },
      params: RequestParams = {}
    ) =>
      this.request<RestaurantDto[], any>({
        path: `/restaurants`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags restaurants
     * @name RestaurantsControllerCreate
     * @summary レストランを作成する
     * @request POST:/restaurants
     */
    restaurantsControllerCreate: (
      data: CreateRestaurantDto,
      params: RequestParams = {}
    ) =>
      this.request<RestaurantDto, any>({
        path: `/restaurants`,
        method: 'POST',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags restaurants
     * @name RestaurantsControllerFindOne
     * @summary レストランを取得する
     * @request GET:/restaurants/{id}
     */
    restaurantsControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<RestaurantDto, any>({
        path: `/restaurants/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags restaurants
     * @name RestaurantsControllerUpdate
     * @summary レストランを更新する
     * @request PATCH:/restaurants/{id}
     */
    restaurantsControllerUpdate: (
      id: string,
      data: UpdateRestaurantDto,
      params: RequestParams = {}
    ) =>
      this.request<RestaurantDto, any>({
        path: `/restaurants/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),
  };
  menus = {
    /**
     * No description
     *
     * @tags menus
     * @name MenusControllerFindAll
     * @summary 指定されたアレルギー情報を含まないメニュー一覧を取得する
     * @request GET:/menus
     */
    menusControllerFindAll: (
      query: {
        /** アレルギー情報のID */
        ingredientIds?: string[];
        restaurantId: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<MenuDto[], any>({
        path: `/menus`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags menus
     * @name MenusControllerCreate
     * @summary アレルギー情報を含んだメニューを作成する
     * @request POST:/menus
     */
    menusControllerCreate: (data: CreateMenuDto, params: RequestParams = {}) =>
      this.request<MenuDto[], any>({
        path: `/menus`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags menus
     * @name MenusControllerFindOne
     * @summary 指定されたメニューを取得する
     * @request GET:/menus/{id}
     */
    menusControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<MenuDto, any>({
        path: `/menus/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags menus
     * @name MenusControllerUpdate
     * @summary メニューを更新する
     * @request PATCH:/menus/{id}
     */
    menusControllerUpdate: (
      id: string,
      data: UpdateMenuDto,
      params: RequestParams = {}
    ) =>
      this.request<MenuDto, any>({
        path: `/menus/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description 指定したIDのメニューを物理削除する
     *
     * @tags menus
     * @name MenusControllerRemove
     * @summary メニューを削除する
     * @request DELETE:/menus/{id}
     */
    menusControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<DeleteMenuDto, any>({
        path: `/menus/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),
  };
}
