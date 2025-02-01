import { z } from "zod";
import { performGoogleSearch } from '../toolsImpl/searchTool/index.js';
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSearchTool(server: McpServer) {
  server.tool(
    "web-search",
    "Search webpages and get a specific page of results (each page has ~10 results). Optionally filter by site and timeframe.",
    {
      query_text: z.string().min(1).describe("Search query text (Google query operators not supported)"),
      site: z.string().optional().describe("Limit search to specific domain"),
      timeframe: z.discriminatedUnion('type', [
        z.object({
          type: z.literal('relative').describe('Use relative as the search type'),
          period: z.enum(['h', 'd', 'w', 'm', 'y']).describe('h=hour,d=day,w=week,m=month,y=year')
        }),
        z.object({
          type: z.literal('custom'),
          startDate: z.date().describe("Start date for custom time range filter"),
          endDate: z.date().describe("End date for custom time range filter")
        })
      ]).optional().describe("Time range filter (relative: h/d/w/m/y or custom date range)"),
      pageNumber: z.number().min(1).max(5).optional().default(1).describe(
        "Which page of results to fetch (1-5). Each page contains ~10 results"
      )
    },
    async ({ query_text, site, timeframe, pageNumber }) => {
      console.error(`Executing Google search for: ${query_text} (page ${pageNumber})`);
      try {
        const searchParams = { query: query_text, site, timeframe };
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
