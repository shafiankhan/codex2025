/**
 * Comprehensive tests for CareerNavigatorAgent
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  CareerNavigatorAgent, 
  AgentRegistrationError,
  AgentNotRegisteredError,
  InvalidRequestError,
  PaymentVerificationError,
  ServiceNotImplementedError
} from './agent.js';
import { config } from './config.js';

describe('CareerNavigatorAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new CareerNavigatorAgent(config);
  });

  describe('Initialization', () => {
    it('should initialize with config and default state', () => {
      expect(agent.config).toBe(config);
      expect(agent.isRegistered).toBe(false);
      expect(agent.registrationError).toBe(null);
      expect(agent.services).toBeDefined();
    });

    it('should initialize services with correct pricing', () => {
      const services = agent.services;
      expect(services.assessment.price).toBe(0.5);
      expect(services.roadmap.price).toBe(1.5);
      expect(services.catalyst.price).toBe(3.0);
      expect(services.assessment.currency).toBe('ADA');
    });

    it('should have service metadata', () => {
      const services = agent.services;
      expect(services.assessment.name).toBe('Skills Assessment');
      expect(services.assessment.description).toContain('on-chain activity');
      expect(services.assessment.requirements).toBeInstanceOf(Array);
    });
  });

  describe('Agent Registration', () => {
    it('should register successfully with valid config', async () => {
      const result = await agent.register();
      
      expect(agent.isRegistered).toBe(true);
      expect(agent.registrationError).toBe(null);
      expect(result.success).toBe(true);
      expect(result.agentId).toBe(config.masumi.agentId);
      expect(result.network).toBe(config.network);
    });

    it('should throw AgentRegistrationError on invalid config', async () => {
      // Create agent with invalid config
      const invalidConfig = { 
        ...config, 
        masumi: { ...config.masumi, agentId: null } 
      };
      const invalidAgent = new CareerNavigatorAgent(invalidConfig);
      
      await expect(invalidAgent.register()).rejects.toThrow(AgentRegistrationError);
    });

    it('should validate required configuration fields', async () => {
      const invalidConfig = { 
        ...config, 
        masumi: { ...config.masumi, agentId: undefined } 
      };
      const invalidAgent = new CareerNavigatorAgent(invalidConfig);
      
      await expect(invalidAgent.register()).rejects.toThrow('Missing required configuration');
    });

    it('should validate pricing values', async () => {
      const invalidConfig = { 
        ...config, 
        pricing: { ...config.pricing, assessment: -1 },
        masumi: { ...config.masumi, agentId: 'test-agent' }
      };
      const invalidAgent = new CareerNavigatorAgent(invalidConfig);
      
      await expect(invalidAgent.register()).rejects.toThrow('All service prices must be positive values');
    });

    it('should validate network configuration', async () => {
      const invalidConfig = { 
        ...config, 
        network: 'invalid',
        masumi: { ...config.masumi, agentId: 'test-agent' }
      };
      const invalidAgent = new CareerNavigatorAgent(invalidConfig);
      
      await expect(invalidAgent.register()).rejects.toThrow('Network must be either "preprod" or "mainnet"');
    });
  });

  describe('Request Processing', () => {
    beforeEach(async () => {
      // Create a fresh agent for each test to avoid registration state issues
      agent = new CareerNavigatorAgent(config);
      await agent.register();
    });

    it('should throw error when not registered', async () => {
      const unregisteredAgent = new CareerNavigatorAgent(config);
      const request = { 
        type: 'assessment', 
        userAddress: 'addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7' 
      };
      
      await expect(unregisteredAgent.processRequest(request)).rejects.toThrow(AgentNotRegisteredError);
    });

    it('should validate request structure', async () => {
      await expect(agent.processRequest(null)).rejects.toThrow(InvalidRequestError);
      await expect(agent.processRequest('invalid')).rejects.toThrow(InvalidRequestError);
    });

    it('should validate service type', async () => {
      const request = { 
        type: 'unknown', 
        userAddress: 'addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7' 
      };
      
      await expect(agent.processRequest(request)).rejects.toThrow(InvalidRequestError);
      await expect(agent.processRequest(request)).rejects.toThrow(/Available: assessment, roadmap, catalyst/);
    });

    it('should validate user address', async () => {
      const request = { type: 'assessment', userAddress: '' };
      await expect(agent.processRequest(request)).rejects.toThrow(InvalidRequestError);
      
      const request2 = { type: 'assessment', userAddress: 'invalid_address' };
      await expect(agent.processRequest(request2)).rejects.toThrow('Invalid Cardano wallet address format');
    });

    it('should validate timeline for roadmap service', async () => {
      const request = { 
        type: 'roadmap', 
        userAddress: 'addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7' 
      };
      
      await expect(agent.processRequest(request)).rejects.toThrow('Timeline is required for roadmap service');
      
      const request2 = { ...request, timeline: 'invalid' };
      await expect(agent.processRequest(request2)).rejects.toThrow('Timeline must be one of: 3-months, 6-months, 12-months');
    });

    it('should accept valid Cardano addresses', async () => {
      const validAddresses = [
        'addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7',
        'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjmg',
        'stake_test1uqevw2xnsc0pvn9t9r9c928uwfrmqc77e85y4qhzuracvgqp8tpse',
        'stake1uyehkck0lajq8gr28t9uxnuvgcqrc6070x3k9r8048z8y5gh6ffgw'
      ];

      for (const address of validAddresses) {
        expect(agent._isValidCardanoAddress(address)).toBe(true);
      }
    });
  });

  describe('Service Handlers', () => {
    beforeEach(async () => {
      agent = new CareerNavigatorAgent(config);
      await agent.register();
    });

    it('should handle assessment service request structure', async () => {
      const request = { 
        type: 'assessment', 
        userAddress: 'test_address_a', // Use mock address for testing
        paymentTxHash: 'test_tx_hash'
      };
      
      const response = await agent.processRequest(request);
      
      expect(response.success).toBe(true);
      expect(response.service).toBe('assessment');
      expect(response.userAddress).toBe(request.userAddress);
      expect(response.profile).toBeDefined();
      expect(response.profile.experienceLevel).toBeDefined();
      expect(response.profile.technicalSkills).toBeInstanceOf(Array);
      expect(response.profile.interests).toBeInstanceOf(Array);
      expect(response.insights).toBeInstanceOf(Array);
      expect(response.nextSteps).toBeInstanceOf(Array);
      expect(response.beginWalletIntegration).toBeInstanceOf(Array);
      expect(response.recommendations).toBeDefined();
    });

    it('should handle roadmap service request structure', async () => {
      const request = { 
        type: 'roadmap', 
        userAddress: 'addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7',
        timeline: '6-months',
        paymentTxHash: 'test_tx_hash'
      };
      
      await expect(agent.processRequest(request)).rejects.toThrow(ServiceNotImplementedError);
    });

    it('should handle catalyst service request structure', async () => {
      const request = { 
        type: 'catalyst', 
        userAddress: 'addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7',
        paymentTxHash: 'test_tx_hash'
      };
      
      await expect(agent.processRequest(request)).rejects.toThrow(ServiceNotImplementedError);
    });
  });

  describe('Payment Verification', () => {
    beforeEach(async () => {
      agent = new CareerNavigatorAgent(config);
      await agent.register();
    });

    it('should require payment when not in skip mode', async () => {
      // Temporarily disable skip payment verification
      const originalSkip = agent.config.development.skipPaymentVerification;
      agent.config.development.skipPaymentVerification = false;
      
      const request = { 
        type: 'assessment', 
        userAddress: 'addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7'
      };
      
      await expect(agent.processRequest(request)).rejects.toThrow(PaymentVerificationError);
      
      // Restore original setting
      agent.config.development.skipPaymentVerification = originalSkip;
    });
  });

  describe('Utility Methods', () => {
    it('should return service information', () => {
      const assessmentInfo = agent.getServiceInfo('assessment');
      expect(assessmentInfo.name).toBe('Skills Assessment');
      expect(assessmentInfo.price).toBe(0.5);
      
      const allServices = agent.getServiceInfo();
      expect(Object.keys(allServices)).toEqual(['assessment', 'roadmap', 'catalyst']);
    });

    it('should throw error for unknown service type', () => {
      expect(() => agent.getServiceInfo('unknown')).toThrow(InvalidRequestError);
    });

    it('should return agent status', async () => {
      const statusBefore = agent.getStatus();
      expect(statusBefore.isRegistered).toBe(false);
      
      await agent.register();
      
      const statusAfter = agent.getStatus();
      expect(statusAfter.isRegistered).toBe(true);
      expect(statusAfter.agentId).toBe(config.masumi.agentId);
      expect(statusAfter.network).toBe(config.network);
      expect(statusAfter.services).toEqual(['assessment', 'roadmap', 'catalyst']);
    });
  });

  describe('Configuration Validation', () => {
    it('should have correct pricing configuration', () => {
      expect(config.pricing.assessment).toBe(0.5);
      expect(config.pricing.roadmap).toBe(1.5);
      expect(config.pricing.catalyst).toBe(3.0);
    });

    it('should be configured for preprod network', () => {
      expect(config.network).toBe('preprod');
      expect(config.networkId).toBe(0);
    });

    it('should have Masumi configuration', () => {
      expect(config.masumi.agentId).toBe('cardano-career-navigator');
      expect(config.masumi.endpoint).toBe('https://api.masumi.ai');
      expect(config.masumi.apiKey).toBeDefined();
    });

    it('should have Begin Wallet configuration', () => {
      expect(config.beginWallet.metadataLabel).toBe(100);
      expect(config.beginWallet.deepLinkBase).toBe('https://begin.is');
    });
  });
});