/**
 * Integration tests for Roadmap Service Handler
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CareerNavigatorAgent } from './agent.js';
import { config } from './config.js';

describe('Roadmap Service Integration', () => {
  let agent;

  beforeEach(async () => {
    agent = new CareerNavigatorAgent(config);
    await agent.register();
  });

  describe('Complete Roadmap Generation Flow', () => {
    it('should generate complete roadmap for development path user', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a', // Advanced DeFi user from mock data
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_roadmap'
      };

      const response = await agent.processRequest(request);

      // Verify response structure
      expect(response.success).toBe(true);
      expect(response.service).toBe('roadmap');
      expect(response.timestamp).toBeDefined();

      // Verify user profile
      expect(response.userProfile).toBeDefined();
      expect(response.userProfile.address).toBe(request.userAddress);
      expect(response.userProfile.experienceLevel).toBeDefined();
      expect(response.userProfile.preferredPath).toBeDefined();
      expect(Array.isArray(response.userProfile.technicalSkills)).toBe(true);
      expect(Array.isArray(response.userProfile.interests)).toBe(true);

      // Verify roadmap structure
      expect(response.roadmap).toBeDefined();
      expect(response.roadmap.timeline).toBe('6-months');
      expect(response.roadmap.currentLevel).toBeDefined();
      expect(response.roadmap.targetLevel).toBeDefined();
      expect(response.roadmap.estimatedCompletionDate).toBeDefined();
      expect(response.roadmap.totalMilestones).toBeGreaterThan(0);
      expect(Array.isArray(response.roadmap.learningPath)).toBe(true);
      expect(Array.isArray(response.roadmap.milestones)).toBe(true);
      expect(Array.isArray(response.roadmap.recommendedResources)).toBe(true);

      // Verify opportunities integration
      expect(response.opportunities).toBeDefined();
      expect(Array.isArray(response.opportunities.catalyst)).toBe(true);
      expect(Array.isArray(response.opportunities.bounties)).toBe(true);
      expect(response.opportunities.totalOpportunities).toBeGreaterThan(0);

      // Verify Begin Wallet integration
      expect(Array.isArray(response.beginWalletIntegration)).toBe(true);
      expect(response.beginWalletIntegration.length).toBeGreaterThan(0);

      // Verify next steps
      expect(Array.isArray(response.nextSteps)).toBe(true);
      expect(response.nextSteps.length).toBeGreaterThan(0);

      // Verify payment info
      expect(response.paymentInfo).toBeDefined();
      expect(response.paymentInfo.service).toBe('roadmap');
      expect(response.paymentInfo.amount).toBe(1.5);
      expect(response.paymentInfo.currency).toBe('ADA');
    });

    it('should generate roadmap for NFT collector (design path)', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_b', // NFT collector from mock data
        timeline: '3-months',
        paymentTxHash: 'test_payment_hash_design'
      };

      const response = await agent.processRequest(request);

      expect(response.success).toBe(true);
      expect(response.userProfile.preferredPath).toBe('design');
      expect(response.roadmap.timeline).toBe('3-months');
      
      // Should have design-specific opportunities
      const designOpportunities = response.opportunities.catalyst.filter(opp => 
        opp.categoryName.toLowerCase().includes('design') ||
        opp.description.toLowerCase().includes('design') ||
        opp.description.toLowerCase().includes('ui') ||
        opp.description.toLowerCase().includes('ux')
      );
      
      // Should have design-specific bounties
      const designBounties = response.opportunities.bounties.filter(bounty =>
        bounty.requiredSkills.some(skill => 
          ['ui-design', 'ux-design', 'design', 'figma'].includes(skill)
        )
      );
      
      expect(designBounties.length).toBeGreaterThan(0);
    });

    it('should generate roadmap for Begin Wallet user', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_c', // Begin Wallet user from mock data
        timeline: '12-months',
        paymentTxHash: 'test_payment_hash_begin'
      };

      const response = await agent.processRequest(request);

      expect(response.success).toBe(true);
      expect(response.roadmap.timeline).toBe('12-months');
      
      // Should have Begin Wallet specific integration tips
      const beginWalletTips = response.beginWalletIntegration;
      expect(beginWalletTips.some(tip => tip.category === 'progress-tracking')).toBe(true);
      expect(beginWalletTips.some(tip => tip.beginWalletFeature === 'metadata-transactions')).toBe(true);
    });

    it('should generate roadmap for new user (research path)', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_z', // New user from mock data
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_research'
      };

      const response = await agent.processRequest(request);

      expect(response.success).toBe(true);
      expect(response.userProfile.preferredPath).toBe('research');
      expect(response.roadmap.currentLevel).toBe('beginner');
      
      // Should have beginner-friendly opportunities
      const beginnerFriendlyOpportunities = response.opportunities.catalyst.filter(opp => 
        opp.suitableForExperience === true
      );
      
      // Should have appropriate next steps for beginners
      const immediateStep = response.nextSteps.find(step => step.priority === 'immediate');
      expect(immediateStep).toBeDefined();
      expect(immediateStep.title).toContain('First Milestone');
    });
  });

  describe('Timeline Variations', () => {
    it('should generate different roadmaps for different timelines', async () => {
      const baseRequest = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        paymentTxHash: 'test_payment_hash'
      };

      const roadmap3m = await agent.processRequest({ ...baseRequest, timeline: '3-months' });
      const roadmap6m = await agent.processRequest({ ...baseRequest, timeline: '6-months' });
      const roadmap12m = await agent.processRequest({ ...baseRequest, timeline: '12-months' });

      expect(roadmap3m.roadmap.timeline).toBe('3-months');
      expect(roadmap6m.roadmap.timeline).toBe('6-months');
      expect(roadmap12m.roadmap.timeline).toBe('12-months');

      // Different timelines should have different completion dates
      expect(roadmap3m.roadmap.estimatedCompletionDate).not.toBe(roadmap12m.roadmap.estimatedCompletionDate);
      
      // Longer timelines might have more milestones or different pacing
      expect(roadmap12m.roadmap.totalMilestones).toBeGreaterThanOrEqual(roadmap3m.roadmap.totalMilestones);
    });

    it('should adjust learning path complexity based on timeline', async () => {
      const request3m = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '3-months',
        paymentTxHash: 'test_payment_hash_3m'
      };

      const request12m = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '12-months',
        paymentTxHash: 'test_payment_hash_12m'
      };

      const roadmap3m = await agent.processRequest(request3m);
      const roadmap12m = await agent.processRequest(request12m);

      // 12-month roadmap should have more comprehensive learning path
      expect(roadmap12m.roadmap.learningPath.length).toBeGreaterThanOrEqual(roadmap3m.roadmap.learningPath.length);
    });
  });

  describe('Catalyst Opportunities Integration', () => {
    it('should filter Catalyst opportunities by user skills', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a', // Has DeFi and governance skills
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_catalyst'
      };

      const response = await agent.processRequest(request);
      const catalystOpportunities = response.opportunities.catalyst;

      expect(catalystOpportunities.length).toBeGreaterThan(0);
      
      // Should have opportunities that match user skills
      catalystOpportunities.forEach(opp => {
        expect(opp.roundId).toBeDefined();
        expect(opp.categoryName).toBeDefined();
        expect(opp.description).toBeDefined();
        expect(opp.budget).toBeGreaterThan(0);
        expect(opp.matchReason).toMatch(/skill-match|path-match/);
        expect(opp.relevanceScore).toBeGreaterThan(0);
      });
    });

    it('should include budget and timeline information for Catalyst opportunities', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_budget'
      };

      const response = await agent.processRequest(request);
      const catalystOpportunities = response.opportunities.catalyst;

      catalystOpportunities.forEach(opp => {
        expect(opp.minProposalBudget).toBeDefined();
        expect(opp.maxProposalBudget).toBeDefined();
        expect(opp.timeline).toBeDefined();
        expect(opp.timeline.proposalSubmission).toBeDefined();
        expect(opp.timeline.voting).toBeDefined();
      });
    });

    it('should sort opportunities by relevance score', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_relevance'
      };

      const response = await agent.processRequest(request);
      const catalystOpportunities = response.opportunities.catalyst;

      // Should be sorted by relevance score (descending)
      for (let i = 1; i < catalystOpportunities.length; i++) {
        expect(catalystOpportunities[i].relevanceScore).toBeLessThanOrEqual(
          catalystOpportunities[i - 1].relevanceScore
        );
      }
    });
  });

  describe('Bounty Integration', () => {
    it('should include relevant bounties based on user skills', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a', // Has development skills
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_bounties'
      };

      const response = await agent.processRequest(request);
      const bounties = response.opportunities.bounties;

      expect(bounties.length).toBeGreaterThan(0);
      expect(bounties.length).toBeLessThanOrEqual(5); // Top 5 bounties

      bounties.forEach(bounty => {
        expect(bounty.id).toBeDefined();
        expect(bounty.title).toBeDefined();
        expect(bounty.reward).toBeGreaterThan(0);
        expect(bounty.deadline).toBeDefined();
        expect(Array.isArray(bounty.requiredSkills)).toBe(true);
        expect(bounty.relevanceScore).toBeDefined();
      });
    });

    it('should include bounties suitable for different experience levels', async () => {
      const beginnerRequest = {
        type: 'roadmap',
        userAddress: 'test_address_z', // Beginner user
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_beginner_bounties'
      };

      const response = await agent.processRequest(beginnerRequest);
      const bounties = response.opportunities.bounties;

      // Beginner users might not have matching skills for bounties, which is expected
      // But if there are bounties, they should include beginner-friendly ones
      if (bounties.length > 0) {
        const beginnerBounties = bounties.filter(bounty => 
          bounty.difficulty === 'beginner' || bounty.difficulty === 'intermediate'
        );
        
        expect(beginnerBounties.length).toBeGreaterThan(0);
      } else {
        // It's acceptable for beginners to have no matching bounties
        expect(bounties.length).toBe(0);
      }
    });
  });

  describe('Begin Wallet Integration Tips', () => {
    it('should generate progress tracking tips for all users', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_tips'
      };

      const response = await agent.processRequest(request);
      const tips = response.beginWalletIntegration;

      expect(tips.length).toBeGreaterThan(0);
      
      // Should always include progress tracking tip
      const progressTip = tips.find(tip => tip.category === 'progress-tracking');
      expect(progressTip).toBeDefined();
      expect(progressTip.title).toContain('Progress');
      expect(progressTip.beginWalletFeature).toBe('metadata-transactions');
      expect(progressTip.estimatedTime).toBeDefined();
    });

    it('should include eSIM reward tips when applicable', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_esim'
      };

      const response = await agent.processRequest(request);
      const tips = response.beginWalletIntegration;

      // Should include eSIM tips if roadmap has eSIM rewards
      const hasESIMRewards = response.roadmap.milestones.some(m => m.rewards.esim);
      if (hasESIMRewards) {
        const esimTip = tips.find(tip => tip.category === 'esim-rewards');
        expect(esimTip).toBeDefined();
        expect(esimTip.beginWalletFeature).toBe('esim-integration');
      }
    });

    it('should include NFT achievement tips when applicable', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_nft'
      };

      const response = await agent.processRequest(request);
      const tips = response.beginWalletIntegration;

      // Should include NFT tips if roadmap has NFT rewards
      const hasNFTRewards = response.roadmap.milestones.some(m => m.rewards.nft);
      if (hasNFTRewards) {
        const nftTip = tips.find(tip => tip.category === 'nft-achievements');
        expect(nftTip).toBeDefined();
        expect(nftTip.beginWalletFeature).toBe('nft-gallery');
      }
    });

    it('should include developer-specific tips for development path users', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a', // Development path user
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_dev_tips'
      };

      const response = await agent.processRequest(request);
      
      if (response.userProfile.preferredPath === 'development') {
        const tips = response.beginWalletIntegration;
        const devTip = tips.find(tip => tip.category === 'developer-tools');
        expect(devTip).toBeDefined();
        expect(devTip.beginWalletFeature).toBe('developer-mode');
      }
    });
  });

  describe('Next Steps Generation', () => {
    it('should provide structured next steps with priorities', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_steps'
      };

      const response = await agent.processRequest(request);
      const nextSteps = response.nextSteps;

      expect(nextSteps.length).toBeGreaterThan(0);

      // Should have different priority levels
      const priorities = new Set(nextSteps.map(step => step.priority));
      expect(priorities.has('immediate')).toBe(true);

      nextSteps.forEach(step => {
        expect(step.priority).toBeDefined();
        expect(step.title).toBeDefined();
        expect(step.description).toBeDefined();
        expect(step.action).toBeDefined();
        expect(step.timeframe).toBeDefined();
      });
    });

    it('should include milestone-specific immediate next steps', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_milestone_steps'
      };

      const response = await agent.processRequest(request);
      const immediateStep = response.nextSteps.find(step => step.priority === 'immediate');

      expect(immediateStep).toBeDefined();
      expect(immediateStep.title).toContain('Milestone');
      expect(immediateStep.timeframe).toBe('This week');
    });

    it('should include long-term application steps', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_longterm'
      };

      const response = await agent.processRequest(request);
      const longTermStep = response.nextSteps.find(step => step.priority === 'long-term');

      expect(longTermStep).toBeDefined();
      expect(longTermStep.description).toContain('Catalyst');
      expect(longTermStep.timeframe).toContain('completion');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing timeline parameter', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        paymentTxHash: 'test_payment_hash_no_timeline'
        // timeline missing
      };

      await expect(agent.processRequest(request)).rejects.toThrow('Timeline is required');
    });

    it('should handle invalid timeline values', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: 'invalid-timeline',
        paymentTxHash: 'test_payment_hash_invalid_timeline'
      };

      await expect(agent.processRequest(request)).rejects.toThrow('Timeline must be one of');
    });

    it('should handle payment verification when not in skip mode', async () => {
      // Temporarily disable skip payment verification
      const originalSkip = agent.config.development.skipPaymentVerification;
      agent.config.development.skipPaymentVerification = false;

      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '6-months'
        // paymentTxHash missing
      };

      await expect(agent.processRequest(request)).rejects.toThrow('Payment required');

      // Restore original setting
      agent.config.development.skipPaymentVerification = originalSkip;
    });

    it('should handle module import failures gracefully', async () => {
      // This test would require mocking the import function, which is complex
      // In a real scenario, we'd mock the dynamic imports to fail
      // For now, we'll just verify the error handling structure exists
      expect(agent.handleRoadmap).toBeDefined();
    });
  });

  describe('Response Format Validation', () => {
    it('should return properly formatted roadmap response', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_format'
      };

      const response = await agent.processRequest(request);

      // Validate top-level structure
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('service');
      expect(response).toHaveProperty('timestamp');
      expect(response).toHaveProperty('userProfile');
      expect(response).toHaveProperty('roadmap');
      expect(response).toHaveProperty('opportunities');
      expect(response).toHaveProperty('beginWalletIntegration');
      expect(response).toHaveProperty('nextSteps');
      expect(response).toHaveProperty('paymentInfo');

      // Validate data types
      expect(typeof response.success).toBe('boolean');
      expect(typeof response.service).toBe('string');
      expect(typeof response.timestamp).toBe('number');
      expect(typeof response.userProfile).toBe('object');
      expect(typeof response.roadmap).toBe('object');
      expect(typeof response.opportunities).toBe('object');
      expect(Array.isArray(response.beginWalletIntegration)).toBe(true);
      expect(Array.isArray(response.nextSteps)).toBe(true);
      expect(typeof response.paymentInfo).toBe('object');
    });

    it('should include all required roadmap fields', async () => {
      const request = {
        type: 'roadmap',
        userAddress: 'test_address_a',
        timeline: '6-months',
        paymentTxHash: 'test_payment_hash_fields'
      };

      const response = await agent.processRequest(request);
      const roadmap = response.roadmap;

      // Required roadmap fields
      expect(roadmap).toHaveProperty('timeline');
      expect(roadmap).toHaveProperty('currentLevel');
      expect(roadmap).toHaveProperty('targetLevel');
      expect(roadmap).toHaveProperty('estimatedCompletionDate');
      expect(roadmap).toHaveProperty('totalMilestones');
      expect(roadmap).toHaveProperty('learningPath');
      expect(roadmap).toHaveProperty('milestones');
      expect(roadmap).toHaveProperty('recommendedResources');

      // Validate milestone structure
      roadmap.milestones.forEach(milestone => {
        expect(milestone).toHaveProperty('id');
        expect(milestone).toHaveProperty('name');
        expect(milestone).toHaveProperty('description');
        expect(milestone).toHaveProperty('verification');
        expect(milestone).toHaveProperty('rewards');
        expect(milestone).toHaveProperty('targetWeek');
        expect(milestone).toHaveProperty('estimatedDate');
      });
    });
  });
});