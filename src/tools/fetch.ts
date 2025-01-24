import { z } from "zod";
import { getPageContent } from '../browser/chrome.js';
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerFetchTool(server: McpServer) {
  server.tool(
    "fetch-webpage-text",
    "Extract readable text content from a given webpage URL using Chrome browser automation",
    {
      url: z.string().url().describe("Full webpage URL (must include http:// or https://)"),
    },
    async ({ url }) => {
      console.error(`Fetching content from: ${url}`);
      try {
        const content = await getPageContent(url);
        return { content: [{ type: "text", text: content }] };
      } catch (error) {
        return {
          content: [{ 
            type: "text",
            text: `Content fetch failed - please try again: ${error instanceof Error ? error.message : String(error)}`
          }]
        };
      }
    }
  );
}