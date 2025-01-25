import { z } from "zod";
import { performGoogleSearch } from '../toolsImpl/searchTool/index.js';
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSearchTool(server: McpServer) {
  server.tool(
    "web-search",
    "Search webpages and get a specific page of results (each page has ~10 results). Optionally filter by site and timeframe.",
    {
      query: z.string().min(1).describe("Search query text"),
      site: z.string().optional().describe("Limit search to specific domain"),
      timeframe: z.discriminatedUnion('type', [
        z.object({
          type: z.literal('relative'),
          period: z.enum(['h', 'd', 'w', 'm', 'y'])
        }),
        z.object({
          type: z.literal('custom'),
          startDate: z.date(),
          endDate: z.date()
        })
      ]).optional().describe("Time range filter (relative: h/d/w/m/y or custom date range)"),
      pageNumber: z.number().min(1).max(5).optional().default(1).describe(
        "Which page of results to fetch (1-5). Each page contains ~10 results"
      )
    },
    async ({ query, site, timeframe, pageNumber }) => {
      console.error(`Executing Google search for: ${query} (page ${pageNumber})`);
      try {
        const searchParams = { query, site, timeframe };
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