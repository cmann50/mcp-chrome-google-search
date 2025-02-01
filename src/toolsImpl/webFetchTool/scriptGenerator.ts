export function generateAppleScript(url: string): string {
  const script = `
    tell application "Google Chrome"
      make new window with properties {bounds:{50, 50, 425, 717}}
      set newWindow to window 1
      
      tell newWindow
        set URL of active tab to "${url}"
      end tell
      
      -- Return focus to Claude
      tell application "Claude" to activate

      -- Wait for page to load
      tell active tab of newWindow
        repeat until (loading is false)
          delay 0.1
        end repeat
      end tell
      
      -- Get page content
      tell active tab of newWindow
        set pageContent to (execute javascript "document.documentElement.outerHTML;")
      end tell
      
      -- Close the window
      close newWindow
    end tell
    
    return pageContent
  `;
  return script;
}