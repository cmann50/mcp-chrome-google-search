import { performGoogleSearch } from '../../src/toolsImpl/searchTool';
import type { SearchParams } from '../../src/types/search';

describe('web-search Tool', () => {
  it('should perform a search and return concatenated results', async () => {
    const searchParams: SearchParams = {
      query: 'test search'
    };
    
    try {
      const result = await performGoogleSearch(searchParams);
      expect(result.length).toBeGreaterThan(0);
      
      const blocks = result.split('\n\n');
      expect(blocks.length).toBeGreaterThan(1);
      
      blocks.forEach((block: string) => {
        const [url, description] = block.split('\n');
        expect(url).toMatch(/^https?:\/\/.+/);
        expect(description?.length).toBeGreaterThan(0);
      });
      
      console.log('Search Results:');
      console.log('-----------------');
      console.log(result);
      console.log('-----------------');
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error('Should not throw an error: ' + errorMessage);
    }
  }, 30000);

  it('should handle site operator in query string', async () => {
    const searchParams: SearchParams = {
      query: 'site:nodejs.org documentation'
    };
    
    try {
      const result = await performGoogleSearch(searchParams);
      expect(result.length).toBeGreaterThan(0);
      
      const blocks = result.split('\n\n');
      blocks.forEach((block: string) => {
        const [url] = block.split('\n');
        expect(url).toContain('nodejs.org');
      });
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error('Should not throw an error: ' + errorMessage);
    }
  }, 30000);

  it('should fetch multiple pages of results', async () => {
    const searchParams: SearchParams = {
      query: 'site:github.com test'
    };
    
    try {
      // Get results from multiple pages
      const results = await performGoogleSearch(searchParams, 2);
      
      // Should have more results when fetching multiple pages
      const blocks = results.split('\n\n');
      expect(blocks.length).toBeGreaterThan(10);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error('Should not throw an error: ' + errorMessage);
    }
  }, 30000);
});