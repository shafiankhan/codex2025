/**
 * Configuration for Cardano Career Navigator
 * Preprod testnet configuration for hackathon development
 */

export const config = {
  // Network Configuration
  network: 'preprod',
  networkId: 0, // Preprod testnet network ID
  
  // Cardano Network Endpoints
  cardano: {
    blockfrost: {
      url: 'https://cardano-preprod.blockfrost.io/api/v0',
      projectId: process.env.BLOCKFROST_PROJECT_ID || 'preprod_placeholder'
    },
    koios: {
      url: 'https://preprod.koios.rest/api/v1'
    }
  },

  // Service Pricing (in ADA)
  pricing: {
    assessment: 0.5,    // Skills assessment service
    roadmap: 1.5,       // Career roadmap generation
    catalyst: 3.0       // Project Catalyst guidance
  },

  // Masumi Platform Configuration
  masumi: {
    // TODO: Add actual Masumi configuration when SDK is available
    agentId: process.env.MASUMI_AGENT_ID || 'cardano-career-navigator',
    apiKey: process.env.MASUMI_API_KEY || 'placeholder_key',
    endpoint: process.env.MASUMI_ENDPOINT || 'https://api.masumi.ai'
  },

  // Begin Wallet Integration
  beginWallet: {
    metadataLabel: 100, // Standard label for ratings/progress tracking
    deepLinkBase: 'https://begin.is',
    policyId: process.env.BEGIN_POLICY_ID || 'placeholder_policy_id'
  },

  // External API Configuration
  apis: {
    catalyst: {
      baseUrl: 'https://api.catalyst.ideascale.com',
      timeout: 10000
    },
    cardanoDeveloperPortal: {
      baseUrl: 'https://developers.cardano.org'
    }
  },

  // Application Settings
  app: {
    name: 'Cardano Career Navigator',
    version: '1.0.0',
    description: 'Personalized career guidance for the Cardano ecosystem',
    maxTransactionHistory: 1000, // Maximum transactions to analyze
    cacheTimeout: 300000, // 5 minutes cache timeout
    retryAttempts: 3
  },

  // Development Settings
  development: {
    enableLogging: true,
    enableMockData: true,
    skipPaymentVerification: true, // Skip payments for testnet demo
    useTestnetPricing: true // Use lower prices for testnet
  },

  // Testnet-specific pricing (lower for testing)
  testnetPricing: {
    assessment: 0.1,    // 0.1 tADA for testing
    roadmap: 0.3,       // 0.3 tADA for testing
    catalyst: 0.5       // 0.5 tADA for testing
  }
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'development') {
  config.development.enableLogging = true;
  config.development.enableMockData = true;
}

if (process.env.NODE_ENV === 'production') {
  config.development.enableLogging = false;
  config.development.enableMockData = false;
  config.development.skipPaymentVerification = false;
}