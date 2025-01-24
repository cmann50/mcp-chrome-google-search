#!/bin/bash

# Show usage if no URL provided
if [ $# -eq 0 ]; then
    echo "Usage: chrome-get-content \"URL\""
    echo "Example: chrome-get-content \"https://example.com\""
    exit 1
fi

# URL encode the input URL (handles special characters)
url=$(echo "$*" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip(), safe=':/?=&'))")

osascript << EOT
tell application "Google Chrome"
    activate
    
    # Navigate to the URL
    open location "${url}"
    
    # Wait for page to load (adjust delay if needed)
    delay 2
    
    # Get the text content
    tell active tab of window 1
        execute javascript "document.body.innerText;"
    end tell
end tell
EOT