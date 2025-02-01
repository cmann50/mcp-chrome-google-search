import { performGoogleSearch } from '../../src/toolsImpl/searchTool';
import type { SearchParams } from '../../src/types/search';

describe('web-search Tool', () => {
  it('should perform a basic search and return results', async () => {
    const searchParams: SearchParams = {
      query_text: 'integration test search'
    };
    
    try {
      const result = await performGoogleSearch(searchParams, 1);
      expect(result.length).toBeGreaterThan(0);
      
      const blocks = result.split('\n\n');
      expect(blocks.length).toBeGreaterThan(1);
      
      blocks.forEach((block: string) => {
        const [url, description] = block.split('\n');
        expect(url).toMatch(/^https?:\/\/.+/);
        expect(description?.length).toBeGreaterThan(0);
      });
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error('Search should succeed: ' + errorMessage);
    }
  }, 30000);

  it('should handle site filtering', async () => {
    const searchParams: SearchParams = {
      query_text: 'documentation',
      site: 'nodejs.org'
    };
    
    try {
      const result = await performGoogleSearch(searchParams, 1);
      expect(result.length).toBeGreaterThan(0);
      
      const blocks = result.split('\n\n');
      blocks.forEach((block: string) => {
        const [url] = block.split('\n');
        expect(url).toContain('nodejs.org');
      });
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error('Search with site filter should succeed: ' + errorMessage);
    }
  }, 30000);

  it('should handle time filtering', async () => {
    const searchParams: SearchParams = {
      query_text: 'news',
      timeframe: 'd'
    };
    
    try {
      const result = await performGoogleSearch(searchParams, 1);
      expect(result.length).toBeGreaterThan(0);
      
      const blocks = result.split('\n\n');
      expect(blocks.length).toBeGreaterThan(1);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error('Search with time filter should succeed: ' + errorMessage);
    }
  }, 30000);

  it('should successfully fetch multiple pages of results', async () => {
    const searchParams: SearchParams = {
      query_text: 'latest news'
    };
    
    try {
      // Test fetching 3 different pages
      for (let page = 1; page <= 3; page++) {
        const results = await performGoogleSearch(searchParams, page);
        
        // Basic validation that we got results
        expect(results.length).toBeGreaterThan(0);
        expect(results.split('\n\n').length).toBeGreaterThan(1);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error('Failed to fetch multiple pages: ' + errorMessage);
    }
  }, 30000);
});