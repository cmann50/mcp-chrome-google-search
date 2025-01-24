import { BrowserOperation } from "./types.js";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

export class BrowserController {
  /**
   * Wraps provided script in Chrome tell block and handles execution
   */
  private generateAppleScript(op: BrowserOperation): string {
    return `tell application "Google Chrome"
  activate
  tell active tab of window 1
    ${op.script}
  end tell
end tell`;
  }

  /**
   * Executes AppleScript via temporary file to avoid escaping issues
   */
  async executeOperation(op: BrowserOperation): Promise<string> {
    const script = this.generateAppleScript(op);
    const scriptPath = join(tmpdir(), `chrome-script-${randomUUID()}.applescript`);
    
    try {
      await writeFile(scriptPath, script, 'utf8');
      const { execScript } = await import("./utils.js");
      return await execScript("osascript", scriptPath);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : String(error);
      throw new Error(`Browser operation failed: ${errorMessage}`);
    } finally {
      // Clean up temp file (use unlink from fs/promises)
      const { unlink } = await import("fs/promises");
      await unlink(scriptPath).catch(() => {}); // Ignore cleanup errors
    }
  }
}

// Helper functions for common operations
export const browserOps = {
  /**
   * Navigate to URL
   */
  navigate: (url: string, timeout = 2): BrowserOperation => ({
    script: `open location "${url}"
    delay ${timeout}`,
  }),

  /**
   * Get page content
   */
  getContent: (): BrowserOperation => ({
    script: 'execute javascript "document.body.innerText;"',
  }),

  /**
   * Click element
   */
  click: (selector: string): BrowserOperation => ({
    script: `execute javascript "
      const el = document.querySelector('${selector}');
      el ? (el.click(), 'Clicked') : 'Not found';"`,
  }),

  /**
   * Type text into element
   */
  type: (selector: string, text: string): BrowserOperation => ({
    script: `execute javascript "
      const el = document.querySelector('${selector}');
      if (el) { el.value = '${text.replace(/'/g, "\\'")}'; 'Typed' }
      else 'Not found';"`,
  }),

  /**
   * Wait for element to appear
   */
  waitForElement: (selector: string, timeout = 10): BrowserOperation => ({
    script: `execute javascript "
      new Promise((resolve) => {
        const check = () => {
          const el = document.querySelector('${selector}');
          if (el) resolve('Found');
          else if ((window.__wait = (window.__wait || 0) + 1) > ${timeout * 10})
            resolve('Timeout');
          else setTimeout(check, 100);
        };
        check();
      });"`,
  }),

  /**
   * Execute arbitrary JavaScript
   */
  executeJs: (code: string): BrowserOperation => ({
    script: `execute javascript "${code.replace(/"/g, '\\"')}"`,
  }),
};
