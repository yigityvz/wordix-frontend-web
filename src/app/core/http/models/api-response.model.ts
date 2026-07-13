/** Bu dosya, backend'in başarılı HTTP cevaplarında kullandığı ortak response zarfını tanımlar. */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly message: string | null;
  readonly data: T;
  readonly timestamp: string;
}
