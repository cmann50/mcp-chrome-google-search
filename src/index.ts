import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { SEARCH_SCRIPT, CONTENT_SCRIPT } from "./config.js";
import { execScript } from "./utils.js";
import { BrowserController, browserOps } from "./browser.js";
import { BrowserOperationSchema } from "./types.js";

// Create server instance
const server = new McpServer({
  name: "google-tools",
  version: "1.0.0",
});

// Browser controller instance
const browser = new BrowserController();

/**
 * Browser Operation Tool
 * Executes AppleScript commands in Chrome browser context.
 * 
 * The script parameter is executed within:
 * tell application "Google Chrome"
 *   activate
 *   tell active tab of window 1
 *     YOUR_SCRIPT_HERE
 *   end tell
 * end tell
 * 
 * Common operations can be constructed using browserOps helpers:
 * - Navigate: browserOps.navigate("https://example.com")
 * - Get Content: browserOps.getContent()
 * - Click: browserOps.click("#some-button")
 * - Type: browserOps.type("#input", "text")
 * - Wait: browserOps.waitForElement(".element", timeout)
 * - Execute JS: browserOps.executeJs("console.log('hello')")
 * 
 * Example direct script:
 * {
 *   "script": "execute javascript \"document.title\"",
 *   "timeout": 5
 * }
 */
server.tool(
  "operate-browser",
  "Execute AppleScript commands in Chrome browser context. See function description for details and examples.",
  {
    operation: BrowserOperationSchema,
  },
  async ({ operation }) => {
    console.error(`Executing browser operation with script: ${operation.script}`);
    try {
      const result = await browser.executeOperation(operation);
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to execute browser operation: ${errorMessage}`,
          },
        ],
      };
    }
  },
);

/**
 * Google Search Tool
 * Performs a Google search and returns formatted results.
 * Uses Chrome browser automation under the hood.
 */
server.tool(
  "google-search",
  "Perform a Google search and return results",
  {
    query: z.string().min(1).describe("Search query string"),
  },
  async ({ query }) => {
    console.error(`Executing Google search for: ${query}`);
    try {
      const results = await execScript(SEARCH_SCRIPT, query);
      return {
        content: [
          {
            type: "text",
            text: results,
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to execute search: ${errorMessage}`,
          },
        ],
      };
    }
  },
);

/**
 * Webpage Content Tool
 * Fetches and returns the text content from a specified URL.
 * Uses Chrome browser automation under the hood.
 */
server.tool(
  "get-webpage-content",
  "Get the text content from a specified webpage URL",
  {
    url: z.string().url().describe("URL of the webpage to fetch"),
  },
  async ({ url }) => {
    console.error(`Fetching content from: ${url}`);
    try {
      const content = await execScript(CONTENT_SCRIPT, url);
      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch webpage content: ${errorMessage}`,
          },
        ],
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Google Tools MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});