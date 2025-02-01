import { buildGoogleSearchUrl } from '../../src/utils/url';
import type { SearchParams } from '../../src/types/search';

describe('web-search URL Generation', () => {
  it('generates basic search URL', () => {
    const params: SearchParams = {
      query_text: 'plain search text'
    };
    const url = buildGoogleSearchUrl(params);
    expect(url).toBe('https://www.google.com/search?q=plain%20search%20text&hl=en&start=0');
  });

  it('generates URL with site filter', () => {
    const params: SearchParams = {
      query_text: 'search text',
      site: 'example.com'
    };
    const url = buildGoogleSearchUrl(params);
    expect(url).toBe('https://www.google.com/search?q=site%3Aexample.com%20search%20text&hl=en&start=0');
  });

  it('generates URLs with time filters', () => {
    const periods: Array<'h' | 'd' | 'w' | 'm' | 'y'> = ['h', 'd', 'w', 'm', 'y'];
    
    periods.forEach(period => {
      const params: SearchParams = {
        query_text: 'news',
        timeframe: period
      };
      const url = buildGoogleSearchUrl(params);
      expect(url).toBe(`https://www.google.com/search?q=news&hl=en&start=0&tbs=qdr:${period}`);
    });
  });

  it('generates URLs for different pages', () => {
    const params: SearchParams = {
      query_text: 'test search'
    };
    
    // Test zero-based page numbers (0 = first page, 1 = second page, etc)
    const testCases = [
      { pageNum: 0, expected: 'https://www.google.com/search?q=test%20search&hl=en&start=0' },
      { pageNum: 1, expected: 'https://www.google.com/search?q=test%20search&hl=en&start=10' },
      { pageNum: 2, expected: 'https://www.google.com/search?q=test%20search&hl=en&start=20' }
    ];
    
    testCases.forEach(({ pageNum, expected }) => {
      const url = buildGoogleSearchUrl(params, pageNum);
      expect(url).toBe(expected);
    });
  });

  it('combines site filter with time filter', () => {
    const params: SearchParams = {
      query_text: 'release notes',
      site: 'github.com',
      timeframe: 'm'
    };
    const url = buildGoogleSearchUrl(params);
    expect(url).toBe('https://www.google.com/search?q=site%3Agithub.com%20release%20notes&hl=en&start=0&tbs=qdr:m');
  });
});