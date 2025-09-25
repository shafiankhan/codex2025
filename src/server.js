/**
 * Simple Express server to serve the frontend and API
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { CareerNavigatorAgent } from './agent.js';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize the Career Navigator Agent
const agent = new CareerNavigatorAgent(config);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/src', express.static(path.join(__dirname, '../src')));

// API Routes
app.post('/api/process', async (req, res) => {
    try {
        console.log('Processing request:', req.body);
        const result = await agent.processRequest(req.body);
        res.json(result);
    } catch (error) {
        console.error('API Error:', error);
        res.status(400).json({
            success: false,
            error: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        });
    }
});

app.get('/api/services/:serviceType?', (req, res) => {
    try {
        const serviceInfo = agent.getServiceInfo(req.params.serviceType);
        res.json(serviceInfo);
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/status', (req, res) => {
    try {
        const status = agent.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
async function startServer() {
    try {
        // Register the agent
        await agent.register();
        console.log('✅ Career Navigator Agent registered successfully');
        
        // Start the server with error handling
        const server = app.listen(PORT, () => {
            console.log(`🚀 Cardano Career Navigator dApp running on http://localhost:${PORT}`);
            console.log(`📊 API available at http://localhost:${PORT}/api`);
            console.log(`🌐 Frontend available at http://localhost:${PORT}`);
            console.log(`\n💡 Tips:`);
            console.log(`   - Connect your Cardano wallet to get started`);
            console.log(`   - Try the demo wallet if you don't have one installed`);
            console.log(`   - Check TROUBLESHOOTING.md if you have issues`);
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use`);
                console.log(`💡 Try using a different port:`);
                console.log(`   PORT=3000 npm run serve`);
                console.log(`   PORT=8081 npm run serve`);
                process.exit(1);
            } else {
                console.error('❌ Server error:', error);
                process.exit(1);
            }
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();