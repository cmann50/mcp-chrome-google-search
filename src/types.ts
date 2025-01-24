import { z } from "zod";

/**
 * Schema for raw AppleScript operations on Chrome browser
 */
export const BrowserOperationSchema = z.object({
  script: z.string(),  // Raw AppleScript code to execute within Chrome tell block
  timeout: z.number().optional()  // Optional timeout in seconds
});

export type BrowserOperation = z.infer<typeof BrowserOperationSchema>;
