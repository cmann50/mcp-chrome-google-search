# MCP Google Search

A Model Context Protocol (MCP) tool for performing Google searches and extracting webpage content using Chrome automation.

## Features

- 🔍 Google search with structured results
- 📄 Webpage content extraction
- 🚀 Fast Chrome automation
- 🔒 Safe URL handling and validation
- ⚡ MCP-compliant interface

## Prerequisites

- Node.js ≥ 16.0.0
- Google Chrome browser
- macOS (for Chrome automation scripts)

## Installation

```bash
npm install -g mcp-google-search
# or
npx mcp-google-search
```

## Usage

### As an MCP Tool

The tool provides two main functions through the MCP interface:

1. Google Search:
```typescript
// Search Google and get results
{
  name: "google-search",
  parameters: {
    query: "your search query"
  }
}
```

2. Webpage Content:
```typescript
// Extract content from a webpage
{
  name: "get-webpage-content",
  parameters: {
    url: "https://example.com"
  }
}
```

### Command Line Usage

```bash
# Start the MCP server
npx mcp-google-search

# The server will listen on stdin/stdout for MCP protocol messages
```

## Configuration

The tool can be configured through environment variables:

```bash
# Timeouts (in milliseconds)
SEARCH_TIMEOUT=5000
CONTENT_FETCH_TIMEOUT=10000

# Chrome automation
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-google-search.git

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Start in development mode
npm run dev
```

## API Reference

### Google Search Tool

Input parameters:
- `query` (string): The search query to execute

Response format:
```typescript
{
  content: [
    {
      type: "text",
      text: string  // Search results in text format
    }
  ]
}
```

### Webpage Content Tool

Input parameters:
- `url` (string): The webpage URL to fetch

Response format:
```typescript
{
  content: [
    {
      type: "text",
      text: string  // Extracted webpage content
    }
  ]
}
```

## Error Handling

The tool includes comprehensive error handling for:
- Network issues
- Invalid URLs
- Chrome automation failures
- Timeout scenarios

All errors are returned in the MCP protocol's standard error format.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Model Context Protocol](https://github.com/modelcontextprotocol/mcp)
- Uses Chrome automation for reliable web interaction
- Inspired by the need for better AI tool integration