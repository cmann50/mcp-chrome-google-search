#!/bin/bash

# Show usage if no query provided
if [ $# -eq 0 ]; then
    echo "Usage: chrome-search \"your search query\""
    echo "Example: chrome-search \"how to make pasta\""
    exit 1
fi

# URL encode the search query
query=$(echo "$*" | python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read().strip()))")

osascript << EOT
tell application "Google Chrome"
    activate
    
    # Do the search
    open location "https://www.google.com/search?q=${query}&hl=en"
    
    # Wait for page to load 
    delay 2
    
    # Get just the text content
    tell active tab of window 1
        execute javascript "document.body.innerText;"
    end tell
end tell
EOT