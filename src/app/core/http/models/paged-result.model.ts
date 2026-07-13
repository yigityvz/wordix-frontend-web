/** Bu dosya, backend'in sayfalanmış liste cevaplarında kullandığı ortak modeli tanımlar. */
export interface PagedResult<T> {
  readonly items: readonly T[] | null;
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly totalCount: number;
  readonly totalPages: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}
