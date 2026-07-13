/** Bu dosya, canlı Swagger'daki admin analytics tarih ve liste query parametrelerini tanımlar. */
export interface AdminAnalyticsDateRangeQuery { readonly fromUtc?:string; readonly toUtc?:string; }
/** Liste endpointlerinde backendin 1–100 aralığında kabul ettiği opsiyonel limit querysidir. */
export interface AdminAnalyticsListQuery extends AdminAnalyticsDateRangeQuery { readonly limit?:number; }
