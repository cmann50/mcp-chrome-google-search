import { z } from "zod";
import { getWebContent } from '../toolsImpl/webFetchTool/index.js';
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerFetchTool(server: McpServer) {
  server.tool(
    "web_fetch",
    "Extract readable text content from a webpage using Chrome browser automation.\n\nKey Features:\n- Returns main content text and optionally links",
    {
      url: z.string().url()
        .describe("Webpage URL to fetch (must include http:// or https://)"),
      
      includeLinks: z.boolean().optional().default(false)
        .describe("Whether to include extracted links in the output")
    },
    async ({ url, includeLinks }) => {
      try {
        const content = await getWebContent(url, { includeLinks });
        if (!content) {
          return {
            content: [{
              type: "text",
              text: "Failed to retrieve web content"
            }]
          };
        }

        // Ensure the content is properly formatted and trimmed
        const formattedContent = content.trim();
        
        return {
          content: [{
            type: "text",
            text: formattedContent
          }]
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{
            type: "text",
            text: `Content fetch failed - please try again: ${errorMessage}`.trim()
          }]
        };
      }
    }
  );
}