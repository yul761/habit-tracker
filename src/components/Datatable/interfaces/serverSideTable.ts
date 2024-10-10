export interface FetchItemsParams {
  page: number
  itemsPerPage: number
  sortBy: { key: string; order: 'asc' | 'desc' }[]
  userId: string
}
export interface FetchItemsResult<T> {
  items: T[]
  total: number
}

export interface Header {
  title: string
  key: string
  align?: 'start' | 'end' | 'center'
  sortable?: boolean
}

export interface SearchField {
  key: string
  placeholder: string
  type?: string
  density?: null | 'default' | 'comfortable' | 'compact'
}
