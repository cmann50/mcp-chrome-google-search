import * as cheerio from 'cheerio';
import type { ParsedContent, Link } from './types.js';

export function parseHtml(htmlContent: string): ParsedContent {
  const $ = cheerio.load(htmlContent);
  
  // Only remove script and style elements
  $('script, style').remove();
  
  // Get meaningful content from the body
  const mainContent: string[] = [];
  
  // Process main content areas
  $('body').find('*').each((_, elem) => {
    const $elem = $(elem);
    
    // Skip hidden elements
    if ($elem.css('display') === 'none' || $elem.css('visibility') === 'hidden') {
      return;
    }
    
    // Get direct text nodes only (not nested text)
    const directText = $elem.clone().children().remove().end().text().trim();
    if (directText && directText.length > 0) {
      mainContent.push(directText);
    }
  });

  // Extract links
  const links: Link[] = [];
  const seenUrls = new Set<string>();
  const seenTexts = new Set<string>();
  
  $('a[href]').each((_, elem) => {
    const $elem = $(elem);
    const url = $elem.attr('href')?.trim();
    const text = $elem.text().trim();
    
    if (!url || !text || seenUrls.has(url) || seenTexts.has(text)) return;
    
    // Skip javascript: and other non-http links
    if (!url.startsWith('javascript:') && 
        !url.startsWith('tel:') &&
        !url.startsWith('mailto:') &&
        text.length > 2) {
      
      // Normalize URLs
      let finalUrl = url;
      if (url.startsWith('//')) {
        finalUrl = 'https:' + url;
      } else if (url.startsWith('/')) {
        // Handle relative URLs later when we have base URL
        finalUrl = url;
      }

      links.push({ text, url: finalUrl });
      seenUrls.add(finalUrl);
      seenTexts.add(text);
    }
  });

  // Clean and format the content
  const text = mainContent
    .filter(section => section.length > 0)
    .map(section => section
      .replace(/\\s+/g, ' ')  // Normalize whitespace
      .trim())
    .join('\\n')
    .replace(/\\n{3,}/g, '\\n\\n')  // Max 2 newlines in a row
    .trim();

  return {
    text: text || 'No content found on the page.',
    links: links.slice(0, 50)  // Include more links
  };
}