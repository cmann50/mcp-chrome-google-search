# MCP Google Search Tool

MCP tool for Google search and webpage content extraction. Works with Claude to enable Google search and content fetching capabilities.

## Platform Support
- ✅ macOS
- ❌ Windows (not supported)
- ❌ Linux (not supported)

## Requirements

1. macOS
2. Google Chrome
3. Node.js 16 or higher

## Quick Start

```bash
npx mcp-google-search
```

## First Time Setup

1. **Grant Accessibility Permissions**
   - When first running the tool, macOS will prompt for accessibility permissions
   - Go to System Preferences > Security & Privacy > Privacy > Accessibility
   - Add Terminal (or your preferred terminal app) to the list
   - Check the box to enable permissions

2. **Enable JavaScript from Apple Events in Chrome**
   - Open Chrome
   - From the menu bar: View > Developer > Allow JavaScript from Apple Events
   - This setting only needs to be enabled once

## Troubleshooting

### Chrome JavaScript Error
If you see this error:
```
execution error: Google Chrome got an error: Executing JavaScript through AppleScript 
is turned off. For more information: https://support.google.com/chrome/?p=applescript (12)
```

Fix:
1. Open Chrome
2. Click View in the menu bar
3. Select Developer
4. Click "Allow JavaScript from Apple Events"
5. Retry your command

### Accessibility Permission Issues
If the tool can't control Chrome:
1. Open System Preferences
2. Go to Security & Privacy > Privacy
3. Select Accessibility from the left sidebar
4. Make sure your terminal app is listed and checked
5. If needed, click the lock icon to make changes

## How It Works

This tool uses AppleScript to control Chrome, allowing Claude to:
- Perform Google searches
- Extract content from webpages

The automation is visible - you'll see Chrome opening and navigating to pages. Don't block or interfere with Chrome while the tool is running.

## Important Notes

- **Chrome Windows**: The tool will open and control Chrome windows. This is normal and required for operation.
- **Performance**: Each request opens a new Chrome tab. Close unused tabs periodically for better performance.
- **Security**: Only use this tool with trusted Claude instances as it can control your Chrome browser.

## Support

For issues or questions:
- Create an issue on GitHub
- Make sure to include your macOS and Chrome versions

## License

MIT License - see LICENSE file for details