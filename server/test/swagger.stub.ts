// @nestjs/swagger v12 は ESM 専用で Jest (CommonJS) から読み込めない。
// テストでは Swagger のメタデータは不要なため、no-op のスタブに差し替える。
// @nestjs/mapped-types も ESM 専用のため、PartialType は元クラスを継承するだけの実装にする。
export const PartialType = <T>(classRef: new (...args: never[]) => T) =>
  class extends (classRef as new () => object) {} as new () => Partial<T>;

const noopDecorator = () => () => undefined;

export const ApiTags = noopDecorator;
export const ApiBody = noopDecorator;
export const ApiConsumes = noopDecorator;
export const ApiOperation = noopDecorator;
export const ApiResponse = noopDecorator;
export const ApiProperty = noopDecorator;
export const ApiPropertyOptional = noopDecorator;
