import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export async function execScript(script: string, args: string): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(`"${script}" "${args}"`);
    if (stderr) {
      console.error('Script error:', stderr);
    }
    return stdout;
  } catch (error) {
    console.error('Execution error:', error);
    throw new Error(`Failed to execute script: ${error.message}`);
  }
}