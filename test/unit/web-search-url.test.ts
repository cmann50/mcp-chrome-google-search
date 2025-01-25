import { buildGoogleSearchUrl } from '../../src/utils/url';
import type { SearchParams } from '../../src/types/search';

describe('web-search URL Generation', () => {
  it('generates basic search URL', () => {
    const params: SearchParams = {
      query: 'news'
    };
    const url = buildGoogleSearchUrl(params);
    expect(url).toBe('https://www.google.com/search?q=news&hl=en&start=0');
  });

  it('generates URL with site operator in query', () => {
    const params: SearchParams = {
      query: 'site:apple.com news'
    };
    const url = buildGoogleSearchUrl(params);
    expect(url).toBe('https://www.google.com/search?q=site%3Aapple.com%20news&hl=en&start=0');
  });

  it('generates URLs with relative time filters', () => {
    const periods: Array<'h' | 'd' | 'w' | 'm' | 'y'> = ['h', 'd', 'w', 'm', 'y'];
    
    const expectedUrls = {
      h: 'https://www.google.com/search?q=site%3Aapple.com%20news&hl=en&start=0&tbs=qdr:h',
      d: 'https://www.google.com/search?q=site%3Aapple.com%20news&hl=en&start=0&tbs=qdr:d',
      w: 'https://www.google.com/search?q=site%3Aapple.com%20news&hl=en&start=0&tbs=qdr:w',
      m: 'https://www.google.com/search?q=site%3Aapple.com%20news&hl=en&start=0&tbs=qdr:m',
      y: 'https://www.google.com/search?q=site%3Aapple.com%20news&hl=en&start=0&tbs=qdr:y'
    };
    
    periods.forEach(period => {
      const params: SearchParams = {
        query: 'news',
        site: 'apple.com',
        timeframe: {
          type: 'relative',
          period
        }
      };
      const url = buildGoogleSearchUrl(params);
      expect(url).toBe(expectedUrls[period]);
    });
  });

  it('generates URL with custom date range', () => {
    const params: SearchParams = {
      query: 'news',
      site: 'apple.com',
      timeframe: {
        type: 'custom',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-31')
      }
    };
    const url = buildGoogleSearchUrl(params);
    expect(url).toBe('https://www.google.com/search?q=site%3Aapple.com%20news&hl=en&start=0&tbs=cdr:1,cd_min:11%2F30%2F2024,cd_max:12%2F30%2F2024');
  });

  it('generates URLs for multi-page results', () => {
    const params: SearchParams = {
      query: 'site:apple.com news'
    };
    
    const expectedUrls = [
      'https://www.google.com/search?q=site%3Aapple.com%20news&hl=en&start=0',
      'https://www.google.com/search?q=site%3Aapple.com%20news&hl=en&start=10',
      'https://www.google.com/search?q=site%3Aapple.com%20news&hl=en&start=20'
    ];
    
    [0, 1, 2].forEach((pageNum, index) => {
      const url = buildGoogleSearchUrl(params, pageNum);
      expect(url).toBe(expectedUrls[index]);
    });
  });

  it('generates URL for complex query with operators', () => {
    const params: SearchParams = {
      query: 'site:arxiv.org quantum computing after:2023 filetype:pdf -preprint'
    };
    const url = buildGoogleSearchUrl(params);
    expect(url).toBe('https://www.google.com/search?q=site%3Aarxiv.org%20quantum%20computing%20after%3A2023%20filetype%3Apdf%20-preprint&hl=en&start=0');
  });
});