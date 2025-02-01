import { z } from "zod";
import { performGoogleSearch } from '../toolsImpl/searchTool/index.js';
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSearchTool(server: McpServer) {
  server.tool(
    "web-search",
    "Search webpages and get a specific page of results (each page has ~10 results). Optionally filter by site and timeframe.",
    {
      query_text: z.string().min(1).describe("Plain text to search for (no Google operators plain text only - use other parameters for site/date filtering)"),
      site: z.string().optional().describe("Limit search to specific domain (e.g. 'github.com' or 'docs.python.org')"),
      timeframe: z.enum(['h', 'd', 'w', 'm', 'y']).optional().describe("Time range filter (h=hour, d=day, w=week, m=month, y=year)"),
      pageNumber: z.number().min(1).max(5).optional().default(1).describe(
        "Which page of results to fetch (1-5). Each page contains ~10 results"
      )
    },
    async ({ query_text, site, timeframe, pageNumber }) => {
      console.error(`Executing Google search for: ${query_text} (page ${pageNumber})`);
      try {
        const searchParams = { query_text, site, timeframe };
        const results = await performGoogleSearch(searchParams, pageNumber);

        return {
          content: [{
            type: "text" as const,
            text: results
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text" as const,
            text: `Search failed - please try again: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );
}
