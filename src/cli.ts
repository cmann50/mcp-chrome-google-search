#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

import('./index.js').catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});