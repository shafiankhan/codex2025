#!/usr/bin/env node

/**
 * Startup script for Cardano Career Navigator dApp
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Cardano Career Navigator dApp...\n');

// Start the server
const server = spawn('node', ['src/server.js'], {
    cwd: __dirname,
    stdio: 'inherit'
});

// Handle server exit
server.on('close', (code) => {
    if (code !== 0) {
        console.error(`❌ Server exited with code ${code}`);
        process.exit(code);
    }
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    server.kill('SIGTERM');
    process.exit(0);
});