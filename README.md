# MCP Chrome Google Search Tool

MCP tool for Google search and webpage content extraction using Chrome browser. Works with Claude to enable Google search and content fetching capabilities.

## Key Advantages

- Runs Chrome browser via osascript/applescript, avoiding typical blocking issues
- Can access authenticated content - Claude can read internal wikis and other logged-in content
- Secure implementation - limited to specific Chrome operations (see `mcp-chrome-google-search/src/browser/chrome.ts`):
  - Page text extraction using `document.body.innerText`
  - Google search via `https://www.google.com/search?q=${encodedQuery}&hl=en`

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
npx mcp-chrome-google-search
```

## Installation & Configuration

### Custom Installation
1. Checkout from git
2. Run `npm run build`
3. Add to Claude config (use absolute path):
```json
{
    "google-tools": {
        "command": "node",
        "args": [
            "/your/checkout/path/mcp/mcp-chrome-google-search/dist/index.js"
        ]
    }
}
```

### First Time Setup

1. **Grant Accessibility Permissions**
   - On first run, approve macOS accessibility permissions prompt
   - Navigate to: System Preferences > Security & Privacy > Privacy > Accessibility
   - Add and enable permissions for your terminal app

2. **Enable Chrome JavaScript from Apple Events**
   - Open Chrome
   - Navigate to: View > Developer > Allow JavaScript from Apple Events
   - One-time setup only

## Debugging

### Log Monitoring
```bash
# Follow logs in real-time
tail -n 20 -F ~/Library/Logs/Claude/mcp*.log
```

### Dev Tools Access
1. Enable developer settings:
```bash
echo '{"allowDevTools": true}' > ~/Library/Application\ Support/Claude/developer_settings.json
```
2. Open DevTools: Command-Option-Shift-i in Claude desktop
3. Use ctrl-r in Claude desktop while tailing for better errors

## Troubleshooting

### Chrome JavaScript Error
If you see:
```
execution error: Google Chrome got an error: Executing JavaScript through AppleScript 
is turned off. For more information: https://support.google.com/chrome/?p=applescript (12)
```

Solution:
1. Open Chrome
2. View > Developer > Allow JavaScript from Apple Events

### Accessibility Permission Issues
If Chrome control fails:
1. Open System Preferences
2. Security & Privacy > Privacy > Accessibility
3. Ensure terminal app is listed and enabled
4. Use lock icon to make changes if needed

## Implementation Details

- Uses AppleScript for Chrome control
- Visible automation - Chrome windows will open/navigate
- Each request opens a new Chrome tab
- Close unused tabs periodically for optimal performance
- Only use with trusted Claude instances (has Chrome control access)

## Support

- Create GitHub issues for problems
- Include macOS and Chrome version details

## License

MIT License - see LICENSE file for details