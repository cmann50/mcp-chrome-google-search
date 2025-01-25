export interface SearchParams {
  query: string;
  site?: string;
  timeframe?: {
    type: 'relative';
    period: 'h' | 'd' | 'w' | 'm' | 'y';
  } | {
    type: 'custom';
    startDate: Date;
    endDate: Date;
  };
}

export interface SearchResult {
  url: string;
  description: string;
}