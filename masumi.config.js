/**
 * Masumi Agent Configuration for Deployment
 * Based on Masumi Agent Template and Deployment Guide
 */

export const masumiConfig = {
  // Agent Metadata
  agent: {
    id: "cardano-career-navigator",
    name: "Cardano Career Navigator",
    description: "AI agent that provides personalized career guidance for the Cardano ecosystem by analyzing on-chain activity and integrating with Begin Wallet features",
    version: "1.0.0",
    author: "Cardano Career Navigator Team",
    tags: ["cardano", "career", "education", "defi", "begin-wallet", "catalyst"],
    category: "education",
    
    // Agent capabilities
    capabilities: [
      "transaction-analysis",
      "career-guidance", 
      "roadmap-generation",
      "catalyst-integration",
      "begin-wallet-integration",
      "payment-processing"
    ],
    
    // Supported networks
    networks: ["cardano-preprod", "cardano-mainnet"],
    
    // Agent icon/avatar (base64 or URL)
    avatar: "🗺️",
    
    // Agent website/documentation
    website: "https://github.com/cardano-career-navigator",
    documentation: "https://github.com/cardano-career-navigator/README.md"
  },

  // Service Configuration
  services: {
    assessment: {
      name: "Skills Assessment",
      description: "Analyze on-chain activity to determine skills and experience level",
      price: 0.5,
      currency: "ADA",
      estimatedTime: "2-3 minutes",
      requirements: ["Valid Cardano wallet address"],
      endpoint: "/api/process",
      method: "POST",
      inputSchema: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["assessment"] },
          userAddress: { type: "string", description: "Cardano wallet address" },
          paymentTxHash: { type: "string", description: "Payment transaction hash" }
        },
        required: ["type", "userAddress"]
      }
    },
    
    roadmap: {
      name: "Career Roadmap",
      description: "Generate personalized learning path with milestones and resources",
      price: 1.5,
      currency: "ADA", 
      estimatedTime: "3-5 minutes",
      requirements: ["Completed skills assessment", "Timeline preference"],
      endpoint: "/api/process",
      method: "POST",
      inputSchema: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["roadmap"] },
          userAddress: { type: "string", description: "Cardano wallet address" },
          timeline: { type: "string", enum: ["3-months", "6-months", "12-months"] },
          paymentTxHash: { type: "string", description: "Payment transaction hash" }
        },
        required: ["type", "userAddress", "timeline"]
      }
    },
    
    catalyst: {
      name: "Catalyst Guidance", 
      description: "Specialized guidance for Project Catalyst proposal creation",
      price: 3.0,
      currency: "ADA",
      estimatedTime: "5-10 minutes", 
      requirements: ["Intermediate+ experience level", "Project concept"],
      endpoint: "/api/process",
      method: "POST",
      inputSchema: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["catalyst"] },
          userAddress: { type: "string", description: "Cardano wallet address" },
          paymentTxHash: { type: "string", description: "Payment transaction hash" }
        },
        required: ["type", "userAddress"]
      }
    }
  },

  // Deployment Configuration
  deployment: {
    // Server configuration
    server: {
      port: process.env.PORT || 8080,
      host: "0.0.0.0",
      cors: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
      }
    },
    
    // Environment variables needed
    environment: {
      NODE_ENV: process.env.NODE_ENV || "production",
      CARDANO_NETWORK: process.env.CARDANO_NETWORK || "preprod",
      MASUMI_API_KEY: process.env.MASUMI_API_KEY,
      MASUMI_AGENT_ID: process.env.MASUMI_AGENT_ID || "cardano-career-navigator"
    },
    
    // Health check endpoint
    healthCheck: {
      endpoint: "/api/status",
      method: "GET",
      expectedResponse: { isRegistered: true }
    },
    
    // Resource requirements
    resources: {
      memory: "512MB",
      cpu: "0.5",
      storage: "1GB"
    }
  },

  // Masumi Integration
  masumi: {
    // Agent registration endpoint
    registrationEndpoint: "https://api.masumi.network/agents/register",
    
    // Payment processing
    payments: {
      network: "cardano-preprod", // Change to mainnet for production
      acceptedCurrencies: ["ADA"],
      paymentTimeout: 300000, // 5 minutes
      confirmations: 1
    },
    
    // Webhook configuration for Masumi callbacks
    webhooks: {
      paymentConfirmed: "/api/webhooks/payment-confirmed",
      serviceRequested: "/api/webhooks/service-requested"
    }
  }
};

export default masumiConfig;