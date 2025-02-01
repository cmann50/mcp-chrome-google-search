import { runOsascript } from '../../utils/osascript.js';
import { buildGoogleSearchUrl } from '../../utils/url.js';
import type { SearchParams, SearchResult } from '../../types/search.js';
import * as cheerio from 'cheerio';

function parseHtml(html: string): SearchResult[] {
  const $ = cheerio.load(html);
  const results: SearchResult[] = [];
  
  // Find all main result containers
  $('.g').each((_, resultDiv) => {
    // Look for the first link in this container
    const link = $(resultDiv).find('a').first();
    const href = link.attr('href');
    
    // Find the description - it's typically the last text block in the container
    const description = $(resultDiv).find('div[style*="-webkit-line-clamp"], div.VwiC3b, .aCOpRe').text();
    
    if (href?.startsWith('http') && 
        !href.includes('google.com') && 
        description.trim().length > 0) {
      results.push({
        url: href,
        description: description.trim()
      });
    }
  });
  
  return results;
}

async function fetchSearchPage(searchParams: SearchParams, pageNumber: number): Promise<SearchResult[]> {
  // Convert 1-based page number to 0-based for URL
  const pageIndex = pageNumber - 1;
  const searchUrl = buildGoogleSearchUrl(searchParams, pageIndex);
  
  const script = `
    tell application "Google Chrome"
      make new window with properties {bounds:{50, 50, 425, 717}}
      set newWindow to window 1
      
      tell newWindow
        set URL of active tab to "${searchUrl}"
      end tell
      
      -- Return focus to Claude
      tell application "Claude" to activate

      -- Wait for page to load
      tell active tab of newWindow
        repeat until (loading is false)
          delay 0.1
        end repeat
      end tell
      
      -- Get page content
      tell active tab of newWindow
        set pageContent to (execute javascript "document.documentElement.outerHTML;")
      end tell
      
      

     
      -- Close the window
      close newWindow
    end tell
    
    return pageContent
  `;

  const html = await runOsascript(script);
  return parseHtml(html);
}

export async function performGoogleSearch(searchParams: SearchParams, pages: number = 1): Promise<string> {
  try {
    const allResults: SearchResult[] = [];
    
    // Fetch results from multiple pages
    for (let page = 1; page <= pages; page++) {
      const pageResults = await fetchSearchPage(searchParams, page);
      allResults.push(...pageResults);
      
      // Add a small delay between page fetches
      if (page < pages) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return allResults.map(r => `${r.url}\n${r.description}`).join('\n\n');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to perform Google search: ${errorMessage}`);
  }
}