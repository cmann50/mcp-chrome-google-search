import type { SearchParams } from '../types/search.js';

function formatDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function buildGoogleSearchUrl(params: SearchParams, pageNum: number = 0): string {
  // Build base query
  let searchQuery = params.query_text;
  
  // Add site restriction if specified
  if (params.site) {
    searchQuery = `site:${params.site} ${searchQuery}`;
  }
  
  // Base URL with encoded query and page number
  let url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&hl=en&start=${pageNum * 10}`;
  
  // Add time restriction if specified
  if (params.timeframe) {
    url += `&tbs=qdr:${params.timeframe}`;
  }
  
  return url;
}