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
 * Web Search Tool
 * Executes a web search using Google and returns structured results.
 * Uses Chrome browser automation to fetch real-time results.
 */
server.tool(
  "search-web",
  "Execute a web search using Google and return structured results including titles, snippets, and links",
  {
    query: z.string().min(1).describe("Search query text - supports standard Google search operators and syntax"),
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
 * Webpage Content Extraction Tool
 * Fetches and extracts readable text content from webpages.
 * Uses Chrome browser automation for reliable rendering and extraction.
 */
server.tool(
  "fetch-webpage-text",
  "Extract readable text content from a given webpage URL using Chrome browser automation",
  {
    url: z.string().url().describe("Full webpage URL (must include http:// or https://)"),
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