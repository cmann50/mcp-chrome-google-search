import { runOsascript } from '../utils/osascript.js';

export async function googleSearch(query: string): Promise<string> {
  const encodedQuery = encodeURIComponent(query);
  const script = `
    tell application "Google Chrome"
      activate
      open location "https://www.google.com/search?q=${encodedQuery}&hl=en"
      delay 2
      tell active tab of window 1
        execute javascript "document.body.innerText;"
      end tell
    end tell
  `;
  return runOsascript(script);
}

export async function getPageContent(url: string): Promise<string> {
  const script = `
    tell application "Google Chrome"
      activate
      open location "${url}"
      delay 2
      tell active tab of window 1
        execute javascript "document.body.innerText;"
      end tell
    end tell
  `;
  return runOsascript(script);
}