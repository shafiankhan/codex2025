/**
 * Cardano Career Navigator - Main Entry Point
 * A Masumi AI agent for personalized Cardano ecosystem career guidance
 */

import { CareerNavigatorAgent } from './agent.js';
import { config } from './config.js';

async function main() {
  try {
    console.log('🚀 Starting Cardano Career Navigator...');
    
    // Initialize the Career Navigator Agent
    const agent = new CareerNavigatorAgent(config);
    
    // Register with Masumi platform
    await agent.register();
    
    console.log('✅ Cardano Career Navigator is ready!');
    console.log(`📍 Network: ${config.network}`);
    console.log(`💰 Services: Assessment (${config.pricing.assessment} ADA), Roadmap (${config.pricing.roadmap} ADA), Catalyst (${config.pricing.catalyst} ADA)`);
    
  } catch (error) {
    console.error('❌ Failed to start Cardano Career Navigator:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Cardano Career Navigator...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down Cardano Career Navigator...');
  process.exit(0);
});

// Start the application
main().catch((error) => {
  console.error('💥 Unhandled error:', error);
  process.exit(1);
});