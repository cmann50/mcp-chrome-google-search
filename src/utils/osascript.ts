import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export async function runOsascript(script: string): Promise<string> {
  const { stdout } = await execFileAsync('osascript', ['-e', script]);
  return stdout;
}