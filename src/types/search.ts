export interface SearchParams {
  query_text: string;
  site?: string;
  timeframe?: 'h' | 'd' | 'w' | 'm' | 'y';
}

export interface SearchResult {
  url: string;
  description: string;
}