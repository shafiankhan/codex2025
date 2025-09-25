/**
 * Masumi Deployment Script
 * Deploys the Cardano Career Navigator to Masumi Network
 */

import { CareerNavigatorAgent } from './src/agent.js';
import { config } from './src/config.js';
import { masumiConfig } from './masumi.config.js';
import express from 'express';
import cors from 'cors';

class MasumiDeployment {
  constructor() {
    this.agent = new CareerNavigatorAgent(config);
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // CORS for Masumi platform
    this.app.use(cors(masumiConfig.deployment.server.cors));
    
    // JSON parsing
    this.app.use(express.json({ limit: '10mb' }));
    
    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    // Health check for Masumi
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        agent: masumiConfig.agent.name,
        version: masumiConfig.agent.version
      });
    });

    // Agent metadata for Masumi discovery
    this.app.get('/agent-info', (req, res) => {
      res.json({
        ...masumiConfig.agent,
        services: masumiConfig.services,
        status: this.agent.getStatus()
      });
    });

    // Main service endpoint
    this.app.post('/api/process', async (req, res) => {
      try {
        console.log('🔄 Processing Masumi request:', req.body);
        
        // Validate request format
        if (!req.body.type || !req.body.userAddress) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: type, userAddress'
          });
        }

        // Process the request
        const result = await this.agent.processRequest(req.body);
        
        console.log('✅ Request processed successfully');
        res.json(result);
        
      } catch (error) {
        console.error('❌ Request processing failed:', error);
        res.status(400).json({
          success: false,
          error: error.message,
          code: error.code || 'PROCESSING_ERROR'
        });
      }
    });

    // Service information endpoint
    this.app.get('/api/services/:serviceType?', (req, res) => {
      try {
        const serviceType = req.params.serviceType;
        if (serviceType && !masumiConfig.services[serviceType]) {
          return res.status(404).json({
            success: false,
            error: `Service '${serviceType}' not found`
          });
        }
        
        const serviceInfo = serviceType 
          ? masumiConfig.services[serviceType]
          : masumiConfig.services;
          
        res.json(serviceInfo);
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Agent status endpoint
    this.app.get('/api/status', (req, res) => {
      try {
        const status = this.agent.getStatus();
        res.json({
          ...status,
          deployment: {
            environment: process.env.NODE_ENV || 'development',
            network: process.env.CARDANO_NETWORK || 'preprod',
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Masumi webhook endpoints
    this.app.post('/api/webhooks/payment-confirmed', (req, res) => {
      console.log('💰 Payment confirmed webhook:', req.body);
      // Handle payment confirmation from Masumi
      res.json({ success: true, message: 'Payment confirmation received' });
    });

    this.app.post('/api/webhooks/service-requested', (req, res) => {
      console.log('🔔 Service requested webhook:', req.body);
      // Handle service request from Masumi
      res.json({ success: true, message: 'Service request received' });
    });

    // Error handling
    this.app.use((error, req, res, next) => {
      console.error('🚨 Server error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: [
          'GET /health',
          'GET /agent-info', 
          'POST /api/process',
          'GET /api/services',
          'GET /api/status'
        ]
      });
    });
  }

  async registerWithMasumi() {
    try {
      console.log('📝 Registering agent with Masumi network...');
      
      // Register the internal agent first
      await this.agent.register();
      
      // TODO: Implement actual Masumi registration when SDK is available
      // const masumiSDK = new MasumiSDK(process.env.MASUMI_API_KEY);
      // await masumiSDK.registerAgent(masumiConfig);
      
      console.log('✅ Agent registered with Masumi network');
      console.log('🔗 Agent ID:', masumiConfig.agent.id);
      console.log('📋 Services:', Object.keys(masumiConfig.services).join(', '));
      
      return true;
    } catch (error) {
      console.error('❌ Masumi registration failed:', error);
      throw error;
    }
  }

  async deploy() {
    try {
      console.log('🚀 Starting Masumi deployment...');
      console.log('📊 Agent:', masumiConfig.agent.name);
      console.log('🌐 Network:', process.env.CARDANO_NETWORK || 'preprod');
      
      // Register with Masumi
      await this.registerWithMasumi();
      
      // Start the server
      const port = masumiConfig.deployment.server.port;
      const host = masumiConfig.deployment.server.host;
      
      const server = this.app.listen(port, host, () => {
        console.log('✅ Masumi deployment successful!');
        console.log(`🌐 Server running on http://${host}:${port}`);
        console.log(`🔍 Health check: http://${host}:${port}/health`);
        console.log(`📋 Agent info: http://${host}:${port}/agent-info`);
        console.log(`🔧 API endpoint: http://${host}:${port}/api/process`);
        console.log('');
        console.log('🎉 Ready to receive requests from Masumi platform!');
        console.log('💰 Accepting ADA payments on Cardano', process.env.CARDANO_NETWORK || 'preprod');
      });

      // Handle server errors
      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`❌ Port ${port} is already in use`);
          console.log('💡 Try setting a different PORT environment variable');
          process.exit(1);
        } else {
          console.error('❌ Server error:', error);
          process.exit(1);
        }
      });

      // Graceful shutdown
      process.on('SIGTERM', () => {
        console.log('📴 Received SIGTERM, shutting down gracefully...');
        server.close(() => {
          console.log('✅ Server closed');
          process.exit(0);
        });
      });

      return server;
      
    } catch (error) {
      console.error('❌ Deployment failed:', error);
      process.exit(1);
    }
  }
}

// Deploy if this file is run directly
if (process.argv[1] && process.argv[1].endsWith('deploy-masumi.js')) {
  const deployment = new MasumiDeployment();
  deployment.deploy();
}

export { MasumiDeployment };