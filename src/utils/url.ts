import type { SearchParams } from '../types/search.js';

function formatDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function buildGoogleSearchUrl(params: SearchParams, pageNum: number = 0): string {
  // Build base query
  let searchQuery = params.query;
  
  // Add site restriction if specified
  if (params.site) {
    searchQuery = `site:${params.site} ${searchQuery}`;
  }
  
  // Base URL with encoded query and page number
  let url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&hl=en&start=${pageNum * 10}`;
  
  // Add time restrictions if specified
  if (params.timeframe) {
    if (params.timeframe.type === 'relative') {
      url += `&tbs=qdr:${params.timeframe.period}`;
    } else {
      const startDate = formatDate(params.timeframe.startDate);
      const endDate = formatDate(params.timeframe.endDate);
      url += `&tbs=cdr:1,cd_min:${encodeURIComponent(startDate)},cd_max:${encodeURIComponent(endDate)}`;
    }
  }
  
  return url;
}