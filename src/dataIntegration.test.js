/**
 * Unit tests for DataIntegration
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DataIntegration } from './dataIntegration.js';
import { config } from './config.js';

describe('DataIntegration', () => {
  let dataIntegration;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      ...config,
      development: {
        ...config.development,
        enableMockData: true
      }
    };
    dataIntegration = new DataIntegration(mockConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
    dataIntegration.clearCache();
  });

  describe('Initialization', () => {
    it('should initialize with config and setup HTTP client', () => {
      expect(dataIntegration.config).toBe(mockConfig);
      expect(dataIntegration.httpClient).toBeDefined();
      expect(dataIntegration.cache).toBeDefined();
      expect(dataIntegration.cacheTimeout).toBeDefined();
      expect(dataIntegration.retryAttempts).toBeDefined();
    });

    it('should use default values for missing config', () => {
      const minimalConfig = { app: { name: 'test', version: '1.0.0' } };
      const integration = new DataIntegration(minimalConfig);
      
      expect(integration.cacheTimeout).toBe(300000); // 5 minutes default
      expect(integration.retryAttempts).toBe(3);
    });
  });

  describe('Catalyst Rounds Integration', () => {
    it('should fetch active Catalyst rounds', async () => {
      const rounds = await dataIntegration.getActiveCatalystRounds();
      
      expect(Array.isArray(rounds)).toBe(true);
      expect(rounds.length).toBeGreaterThan(0);
      
      rounds.forEach(round => {
        expect(round.id).toBeDefined();
        expect(round.name).toBeDefined();
        expect(round.status).toBeDefined();
        expect(round.totalBudget).toBeDefined();
        expect(Array.isArray(round.categories)).toBe(true);
        expect(round.timeline).toBeDefined();
      });
    });

    it('should return cached data on subsequent calls', async () => {
      const firstCall = await dataIntegration.getActiveCatalystRounds();
      const secondCall = await dataIntegration.getActiveCatalystRounds();
      
      expect(firstCall).toEqual(secondCall);
      expect(dataIntegration.cache.has('catalyst_rounds')).toBe(true);
    });

    it('should have properly structured Catalyst categories', async () => {
      const rounds = await dataIntegration.getActiveCatalystRounds();
      const activeRound = rounds.find(r => r.status === 'active');
      
      expect(activeRound).toBeDefined();
      expect(activeRound.categories.length).toBeGreaterThan(0);
      
      activeRound.categories.forEach(category => {
        expect(category.id).toBeDefined();
        expect(category.name).toBeDefined();
        expect(category.budget).toBeDefined();
        expect(category.description).toBeDefined();
        expect(Array.isArray(category.requiredSkills)).toBe(true);
        expect(category.minProposalBudget).toBeDefined();
        expect(category.maxProposalBudget).toBeDefined();
      });
    });

    it('should return fallback data on API failure', async () => {
      // Create integration that will fail
      const failingIntegration = new DataIntegration({
        ...mockConfig,
        development: { enableMockData: false }
      });
      
      // Mock the API call to fail
      failingIntegration._fetchCatalystRoundsFromAPI = vi.fn().mockRejectedValue(new Error('API Error'));
      
      const rounds = await failingIntegration.getActiveCatalystRounds();
      
      expect(Array.isArray(rounds)).toBe(true);
      expect(rounds.length).toBeGreaterThan(0);
      expect(rounds[0].id).toBe('fallback-fund');
    });
  });

  describe('Bounty Integration', () => {
    it('should fetch relevant bounties for given skills', async () => {
      const skills = ['meshjs', 'javascript', 'development'];
      const bounties = await dataIntegration.getRelevantBounties(skills);
      
      expect(Array.isArray(bounties)).toBe(true);
      expect(bounties.length).toBeGreaterThan(0);
      expect(bounties.length).toBeLessThanOrEqual(10); // Should limit to top 10
      
      bounties.forEach(bounty => {
        expect(bounty.id).toBeDefined();
        expect(bounty.title).toBeDefined();
        expect(bounty.description).toBeDefined();
        expect(bounty.reward).toBeDefined();
        expect(bounty.deadline).toBeDefined();
        expect(bounty.status).toBeDefined();
        expect(Array.isArray(bounty.requiredSkills)).toBe(true);
        expect(Array.isArray(bounty.tags)).toBe(true);
      });
    });

    it('should filter bounties by skills correctly', async () => {
      const meshJSBounties = await dataIntegration.getRelevantBounties(['meshjs']);
      const designBounties = await dataIntegration.getRelevantBounties(['ui-design', 'ux-design']);
      
      // MeshJS bounties should include the tutorial series
      const meshJSTutorial = meshJSBounties.find(b => b.id === 'meshjs-tutorial-series');
      expect(meshJSTutorial).toBeDefined();
      
      // Design bounties should include the NFT marketplace UI
      const nftMarketplaceUI = designBounties.find(b => b.id === 'cardano-nft-marketplace-ui');
      expect(nftMarketplaceUI).toBeDefined();
    });

    it('should return top bounties when no skills provided', async () => {
      const bounties = await dataIntegration.getRelevantBounties([]);
      
      expect(Array.isArray(bounties)).toBe(true);
      expect(bounties.length).toBeGreaterThan(0);
      expect(bounties.length).toBeLessThanOrEqual(10);
    });

    it('should sort bounties by relevance', async () => {
      const bounties = await dataIntegration.getRelevantBounties(['defi', 'javascript']);
      
      // Should have relevance scores
      bounties.forEach(bounty => {
        expect(bounty.relevanceScore).toBeDefined();
        expect(typeof bounty.relevanceScore).toBe('number');
      });
      
      // Should be sorted by relevance (descending)
      for (let i = 1; i < bounties.length; i++) {
        expect(bounties[i].relevanceScore).toBeLessThanOrEqual(bounties[i - 1].relevanceScore);
      }
    });

    it('should cache bounty results', async () => {
      const skills = ['development'];
      const firstCall = await dataIntegration.getRelevantBounties(skills);
      const secondCall = await dataIntegration.getRelevantBounties(skills);
      
      expect(firstCall).toEqual(secondCall);
      
      const cacheKey = `bounties_${skills.sort().join('_')}`;
      expect(dataIntegration.cache.has(cacheKey)).toBe(true);
    });

    it('should return fallback data on error', async () => {
      const failingIntegration = new DataIntegration(mockConfig);
      failingIntegration._getAllBounties = vi.fn().mockRejectedValue(new Error('Bounty API Error'));
      
      const bounties = await failingIntegration.getRelevantBounties(['development']);
      
      expect(Array.isArray(bounties)).toBe(true);
      expect(bounties.length).toBeGreaterThan(0);
      expect(bounties[0].id).toBe('fallback-bounty');
    });
  });

  describe('Bounty Relevance Calculation', () => {
    it('should calculate relevance scores correctly', () => {
      const bounty = {
        requiredSkills: ['javascript', 'react'],
        tags: ['development', 'frontend'],
        reward: 5000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days
      };
      
      const skills = ['javascript', 'development'];
      const score = dataIntegration._calculateBountyRelevance(bounty, skills);
      
      expect(score).toBeGreaterThan(0);
      expect(typeof score).toBe('number');
    });

    it('should give higher scores for exact skill matches', () => {
      const bounty = {
        requiredSkills: ['javascript'],
        tags: [],
        reward: 1000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const exactMatchScore = dataIntegration._calculateBountyRelevance(bounty, ['javascript']);
      const partialMatchScore = dataIntegration._calculateBountyRelevance(bounty, ['java']);
      const noMatchScore = dataIntegration._calculateBountyRelevance(bounty, ['python']);
      
      expect(exactMatchScore).toBeGreaterThan(partialMatchScore);
      expect(partialMatchScore).toBeGreaterThan(noMatchScore);
    });

    it('should add bonus for higher rewards', () => {
      const lowRewardBounty = {
        requiredSkills: ['javascript'],
        tags: [],
        reward: 1000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const highRewardBounty = {
        requiredSkills: ['javascript'],
        tags: [],
        reward: 10000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const lowScore = dataIntegration._calculateBountyRelevance(lowRewardBounty, ['javascript']);
      const highScore = dataIntegration._calculateBountyRelevance(highRewardBounty, ['javascript']);
      
      expect(highScore).toBeGreaterThan(lowScore);
    });

    it('should penalize urgent deadlines', () => {
      const urgentBounty = {
        requiredSkills: ['javascript'],
        tags: [],
        reward: 5000,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days
      };
      
      const normalBounty = {
        requiredSkills: ['javascript'],
        tags: [],
        reward: 5000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days
      };
      
      const urgentScore = dataIntegration._calculateBountyRelevance(urgentBounty, ['javascript']);
      const normalScore = dataIntegration._calculateBountyRelevance(normalBounty, ['javascript']);
      
      expect(normalScore).toBeGreaterThan(urgentScore);
    });
  });

  describe('Cardano Metrics', () => {
    it('should fetch Cardano ecosystem metrics', async () => {
      const metrics = await dataIntegration.getCardanoMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics.network).toBeDefined();
      expect(metrics.development).toBeDefined();
      expect(metrics.ecosystem).toBeDefined();
      expect(metrics.catalyst).toBeDefined();
      
      // Network metrics
      expect(metrics.network.currentEpoch).toBeDefined();
      expect(metrics.network.totalStaked).toBeDefined();
      expect(metrics.network.stakingParticipation).toBeDefined();
      
      // Development metrics
      expect(metrics.development.activeDevelopers).toBeDefined();
      expect(metrics.development.githubRepos).toBeDefined();
      
      // Ecosystem metrics
      expect(metrics.ecosystem.dapps).toBeDefined();
      expect(metrics.ecosystem.nftProjects).toBeDefined();
      
      // Catalyst metrics
      expect(metrics.catalyst.totalFunded).toBeDefined();
      expect(metrics.catalyst.projectsFunded).toBeDefined();
    });

    it('should cache metrics data', async () => {
      const firstCall = await dataIntegration.getCardanoMetrics();
      const secondCall = await dataIntegration.getCardanoMetrics();
      
      expect(firstCall).toEqual(secondCall);
      expect(dataIntegration.cache.has('cardano_metrics')).toBe(true);
    });
  });

  describe('Address Validation', () => {
    it('should validate correct Cardano addresses', () => {
      const validAddresses = [
        'addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7',
        'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjmg',
        'stake_test1uqevw2xnsc0pvn9t9r9c928uwfrmqc77e85y4qhzuracvgqp8tpse',
        'stake1uyehkck0lajq8gr28t9uxnuvgcqrc6070x3k9r8048z8y5gh6ffgw'
      ];

      validAddresses.forEach(address => {
        expect(dataIntegration.validateCardanoAddress(address)).toBe(true);
      });
    });

    it('should reject invalid addresses', () => {
      const invalidAddresses = [
        '',
        null,
        undefined,
        'invalid_address',
        'addr_short',
        '1234567890',
        'bitcoin_address_1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      ];

      invalidAddresses.forEach(address => {
        expect(dataIntegration.validateCardanoAddress(address)).toBe(false);
      });
    });
  });

  describe('Cache Management', () => {
    it('should store and retrieve cached data', () => {
      const testData = { test: 'data' };
      dataIntegration._setCache('test_key', testData);
      
      const retrieved = dataIntegration._getFromCache('test_key');
      expect(retrieved).toEqual(testData);
    });

    it('should return null for expired cache entries', () => {
      const testData = { test: 'data' };
      dataIntegration._setCache('test_key', testData);
      
      // Manually expire the cache entry
      const cacheEntry = dataIntegration.cache.get('test_key');
      cacheEntry.timestamp = Date.now() - dataIntegration.cacheTimeout - 1000;
      dataIntegration.cache.set('test_key', cacheEntry);
      
      const retrieved = dataIntegration._getFromCache('test_key');
      expect(retrieved).toBeNull();
      expect(dataIntegration.cache.has('test_key')).toBe(false);
    });

    it('should clear all cache entries', () => {
      dataIntegration._setCache('key1', { data: 1 });
      dataIntegration._setCache('key2', { data: 2 });
      
      expect(dataIntegration.cache.size).toBe(2);
      
      dataIntegration.clearCache();
      
      expect(dataIntegration.cache.size).toBe(0);
    });

    it('should provide cache statistics', () => {
      dataIntegration._setCache('key1', { data: 1 });
      dataIntegration._setCache('key2', { data: 2 });
      
      const stats = dataIntegration.getCacheStats();
      
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
      expect(stats.timeout).toBe(dataIntegration.cacheTimeout);
    });
  });

  describe('Mock Data Quality', () => {
    it('should have realistic Catalyst round data', async () => {
      const rounds = await dataIntegration.getActiveCatalystRounds();
      const activeRound = rounds.find(r => r.status === 'active');
      
      expect(activeRound.totalBudget).toBeGreaterThan(1000000); // At least 1M ADA
      expect(activeRound.categories.length).toBeGreaterThan(0);
      
      // Check category budgets add up reasonably
      const totalCategoryBudget = activeRound.categories.reduce((sum, cat) => sum + cat.budget, 0);
      expect(totalCategoryBudget).toBeLessThanOrEqual(activeRound.totalBudget);
    });

    it('should have diverse bounty types and difficulties', async () => {
      const bounties = await dataIntegration.getRelevantBounties([]);
      
      const difficulties = new Set(bounties.map(b => b.difficulty));
      const skillTypes = new Set(bounties.flatMap(b => b.requiredSkills));
      
      expect(difficulties.size).toBeGreaterThan(1); // Multiple difficulty levels
      expect(skillTypes.size).toBeGreaterThan(5); // Diverse skill requirements
      
      // Should have bounties with different reward ranges
      const rewards = bounties.map(b => b.reward);
      const minReward = Math.min(...rewards);
      const maxReward = Math.max(...rewards);
      expect(maxReward).toBeGreaterThan(minReward * 2); // Significant range
    });

    it('should have realistic Cardano metrics', async () => {
      const metrics = await dataIntegration.getCardanoMetrics();
      
      // Network metrics should be realistic
      expect(metrics.network.currentEpoch).toBeGreaterThan(300);
      expect(metrics.network.totalStaked).toBeGreaterThan(10000000000); // > 10B ADA
      expect(metrics.network.stakingParticipation).toBeGreaterThan(0.5); // > 50%
      expect(metrics.network.stakingParticipation).toBeLessThan(1.0); // < 100%
      
      // Development metrics
      expect(metrics.development.activeDevelopers).toBeGreaterThan(1000);
      expect(metrics.development.smartContracts).toBeGreaterThan(1000);
      
      // Ecosystem metrics
      expect(metrics.ecosystem.dapps).toBeGreaterThan(50);
      expect(metrics.ecosystem.nftProjects).toBeGreaterThan(1000);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const failingIntegration = new DataIntegration({
        ...mockConfig,
        development: { enableMockData: false }
      });
      
      // Mock all API calls to fail
      failingIntegration._fetchCatalystRoundsFromAPI = vi.fn().mockRejectedValue(new Error('Network Error'));
      failingIntegration._getAllBounties = vi.fn().mockRejectedValue(new Error('Network Error'));
      failingIntegration._fetchCardanoMetricsFromAPI = vi.fn().mockRejectedValue(new Error('Network Error'));
      
      // Should not throw errors, but return fallback data
      const rounds = await failingIntegration.getActiveCatalystRounds();
      const bounties = await failingIntegration.getRelevantBounties(['development']);
      const metrics = await failingIntegration.getCardanoMetrics();
      
      expect(Array.isArray(rounds)).toBe(true);
      expect(Array.isArray(bounties)).toBe(true);
      expect(metrics).toBeDefined();
    });

    it('should handle invalid skill arrays', async () => {
      // Should not throw errors for invalid inputs
      const bounties1 = await dataIntegration.getRelevantBounties(null);
      const bounties2 = await dataIntegration.getRelevantBounties(undefined);
      const bounties3 = await dataIntegration.getRelevantBounties('invalid');
      
      expect(Array.isArray(bounties1)).toBe(true);
      expect(Array.isArray(bounties2)).toBe(true);
      expect(Array.isArray(bounties3)).toBe(true);
    });
  });

  describe('Integration with Career Paths', () => {
    it('should provide Catalyst opportunities for development path', async () => {
      const rounds = await dataIntegration.getActiveCatalystRounds();
      const devSkills = ['development', 'smart-contracts', 'cardano'];
      
      const devCategories = rounds.flatMap(round => 
        round.categories.filter(cat => 
          cat.requiredSkills.some(skill => devSkills.includes(skill))
        )
      );
      
      expect(devCategories.length).toBeGreaterThan(0);
      
      devCategories.forEach(category => {
        expect(category.minProposalBudget).toBeDefined();
        expect(category.maxProposalBudget).toBeDefined();
        expect(category.budget).toBeGreaterThan(category.maxProposalBudget);
      });
    });

    it('should provide bounties for different career paths', async () => {
      const devBounties = await dataIntegration.getRelevantBounties(['development', 'javascript']);
      const designBounties = await dataIntegration.getRelevantBounties(['ui-design', 'ux-design']);
      const communityBounties = await dataIntegration.getRelevantBounties(['community', 'education']);
      
      expect(devBounties.length).toBeGreaterThan(0);
      expect(designBounties.length).toBeGreaterThan(0);
      expect(communityBounties.length).toBeGreaterThan(0);
      
      // Should have different bounties for different paths
      const devIds = new Set(devBounties.map(b => b.id));
      const designIds = new Set(designBounties.map(b => b.id));
      
      // Some overlap is okay, but should have path-specific bounties
      expect(devIds.size + designIds.size).toBeGreaterThan(Math.max(devIds.size, designIds.size));
    });
  });
});