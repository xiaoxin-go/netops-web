export type Dict = { [key: string]: string | number | object | boolean | undefined | QueryParams[] | null }
export type QueryType = 'contains' | 'eq' | 'neq' | 'lt' | 'gt' | 'lte' | 'gte' | 'in' | 'not_in'
export interface QueryParams{
  key: string
  val: any
  type: QueryType
}
export interface BreadcrumbOption {
  label: string,
  path: string
}
