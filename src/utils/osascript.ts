import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export async function runOsascript(script: string): Promise<string> {
  // Set maxBuffer to 10MB (10 * 1024 * 1024)
  const { stdout } = await execFileAsync('osascript', ['-e', script], {
    maxBuffer: 10 * 1024 * 1024
  });
  return stdout;
}