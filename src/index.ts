import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { SEARCH_SCRIPT, CONTENT_SCRIPT } from "./config.js";
import { execScript } from "./utils.js";

// Create server instance
const server = new McpServer({
  name: "google-tools",
  version: "1.0.0",
});

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