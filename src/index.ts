import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerSearchTool } from './tools/search.js';
import { registerFetchTool } from './tools/fetch.js';

const server = new McpServer({
  name: "google-tools",
  version: "1.0.0",
});

registerSearchTool(server);
registerFetchTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Google Tools MCP Server running on stdio");
}

main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});