import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { registerFetchTool } from '../../src/tools/fetch';
import { getWebContent } from '../../src/toolsImpl/webFetchTool';
import { generateAppleScript } from '../../src/toolsImpl/webFetchTool/scriptGenerator';
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Define the type for the tool callback
type WebFetchCallback = (params: { url: string; includeLinks?: boolean }) => Promise<{
  content: Array<{ type: string; text: string }>;
}>;

// Mock the script generator
jest.mock('../../src/toolsImpl/webFetchTool/scriptGenerator');

// Mock utils/osascript
jest.mock('../../src/utils/osascript', () => ({
  runOsascript: jest.fn().mockImplementation(async () => {
    // Read the fixture file
    const fixturePath = path.join(__dirname, '../data/wikipedia.home.html');
    return fs.readFileSync(fixturePath, 'utf-8');
  })
}));

describe('Web Fetch Tool', () => {
  const mockServer = {
    tool: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and process web content', async () => {
    // Register the tool
    registerFetchTool(mockServer as unknown as McpServer);

    // Get the callback function that was passed to mockServer.tool
    const toolCallback = mockServer.tool.mock.calls[0][3] as WebFetchCallback;
    
    // Call the callback with test parameters
    const result = await toolCallback({ 
      url: 'https://wikipedia.org', 
      includeLinks: true 
    });

    // Print the returned text for now
    console.log('Returned content:', result.content[0].text);

    // Basic assertions
    expect(result).toBeDefined();
    expect(result.content).toBeInstanceOf(Array);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toBeTruthy();
  });

  // Add more test cases as needed
});
