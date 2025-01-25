export function generateAppleScript(url: string): string {
  const script = `
    tell application "Google Chrome"
      make new window with properties {bounds:{50, 50, 425, 717}}
      set newWindow to window 1
      
      -- Return focus to Claude
      tell application "Claude" to activate
      
      tell tab 1 of newWindow
        set URL to "${url}"
        
        -- Wait for page to load
        repeat until (loading is false)
          delay 0.1
        end repeat
        
        -- Extra delay for dynamic content
        delay 1
        
        -- Get page content with error handling
        try
          set pageContent to (execute javascript "document.documentElement.outerHTML;")
          if pageContent is missing value then
            set pageContent to (execute javascript "document.body.innerHTML;")
          end if
          if pageContent is missing value then
            error "Failed to extract page content"
          end if
        on error errMsg
          close newWindow
          error errMsg
        end try
      end tell
      
      close newWindow
      -- Return focus to Claude
      tell application "Claude" to activate
    end tell
    
    
    return pageContent
  `;
  return script;
}