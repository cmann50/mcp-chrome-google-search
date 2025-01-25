import { runOsascript } from '../../utils/osascript.js';
import { generateAppleScript } from './scriptGenerator.js';
import { parseHtml } from './htmlParser.js';
import type { WebContentOptions } from './types.js';

export async function getWebContent(url: string, options: WebContentOptions = {}): Promise<string> {
  try {
    const script = generateAppleScript(url);
    const rawContent = await runOsascript(script);
    
    if (!rawContent) {
      throw new Error('No content received from page');
    }
    
    const { text, links } = parseHtml(rawContent);
    
    if (!options.includeLinks || links.length === 0) {
      return text;
    }

    return `${text}\n\n=== Links ===\n${links.map(link => 
      `${link.text} (${link.url})`).join('\n')}`;
      
  } catch (error: unknown) {
    throw new Error(`Failed to get web content: ${error instanceof Error ? error.message : String(error)}`);
  }
}