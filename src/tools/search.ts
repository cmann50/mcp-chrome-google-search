import { z } from "zod";
import { googleSearch } from '../browser/chrome.js';
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSearchTool(server: McpServer) {
  server.tool(
    "search-web",
    "Execute a web search using Google and return structured results including titles, snippets, and links",
    {
      query: z.string().min(1).describe("Search query text - supports standard Google search operators and syntax"),
    },
    async ({ query }) => {
      console.error(`Executing Google search for: ${query}`);
      try {
        const results = await googleSearch(query);
        return { content: [{ type: "text", text: results }] };
      } catch (error) {
        return { 
          content: [{ 
            type: "text", 
            text: `Search failed - please try again: ${error instanceof Error ? error.message : String(error)}`
          }]
        };
      }
    }
  );
}