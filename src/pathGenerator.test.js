/**
 * Unit tests for CareerPathGenerator
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CareerPathGenerator } from './pathGenerator.js';
import { config } from './config.js';

describe('CareerPathGenerator', () => {
  let generator;
  let mockUserProfile;

  beforeEach(() => {
    generator = new CareerPathGenerator(config);
    
    mockUserProfile = {
      address: 'test_address',
      experienceLevel: 'beginner',
      technicalSkills: ['wallet-management', 'cardano-basics'],
      interests: ['learning', 'blockchain-technology'],
      learningStyle: 'theoretical',
      preferredPath: 'development'
    };
  });

  describe('Initialization', () => {
    it('should initialize with config and templates', () => {
      expect(generator.config).toBe(config);
      expect(generator.learningPaths).toBeDefined();
      expect(generator.resources).toBeDefined();
      expect(generator.milestoneTemplates).toBeDefined();
    });

    it('should have learning paths for all career tracks', () => {
      const expectedPaths = ['development', 'design', 'community', 'research'];
      expectedPaths.forEach(path => {
        expect(generator.learningPaths[path]).toBeDefined();
        expect(generator.learningPaths[path].beginner).toBeDefined();
      });
    });
  });

  describe('Career Path Generation', () => {
    it('should generate complete career roadmap', async () => {
      const roadmap = await generator.generateCareerPath(mockUserProfile, '6-months');
      
      expect(roadmap).toBeDefined();
      expect(roadmap.timeline).toBe('6-months');
      expect(roadmap.currentLevel).toBe('beginner');
      expect(roadmap.targetLevel).toBe('intermediate');
      expect(roadmap.preferredPath).toBe('development');
      expect(roadmap.learningPath).toBeDefined();
      expect(roadmap.milestones).toBeDefined();
      expect(roadmap.recommendedResources).toBeDefined();
      expect(roadmap.estimatedCompletionDate).toBeDefined();
      expect(roadmap.createdAt).toBeDefined();
      expect(roadmap.userProfile).toBeDefined();
    });

    it('should generate different roadmaps for different timelines', async () => {
      const roadmap3m = await generator.generateCareerPath(mockUserProfile, '3-months');
      const roadmap12m = await generator.generateCareerPath(mockUserProfile, '12-months');
      
      expect(roadmap3m.timeline).toBe('3-months');
      expect(roadmap12m.timeline).toBe('12-months');
      expect(roadmap3m.estimatedCompletionDate).not.toBe(roadmap12m.estimatedCompletionDate);
    });

    it('should throw error for unknown career path', async () => {
      const invalidProfile = { ...mockUserProfile, preferredPath: 'unknown' };
      
      await expect(generator.generateCareerPath(invalidProfile, '6-months'))
        .rejects.toThrow('Unknown career path: unknown');
    });
  });

  describe('Learning Path Generation', () => {
    it('should generate learning path for development track', () => {
      const learningPath = generator.generateLearningPath('development', 'beginner', '6-months');
      
      expect(Array.isArray(learningPath)).toBe(true);
      expect(learningPath.length).toBeGreaterThan(0);
      
      learningPath.forEach(step => {
        expect(step.id).toBeDefined();
        expect(step.title).toBeDefined();
        expect(step.description).toBeDefined();
        expect(step.category).toBeDefined();
        expect(step.difficulty).toBeDefined();
        expect(step.estimatedTime).toBeDefined();
      });
    });

    it('should throw error for unknown path', () => {
      expect(() => generator.generateLearningPath('unknown', 'beginner', '6-months'))
        .toThrow('Unknown career path: unknown');
    });
  });

  describe('Milestone Generation', () => {
    it('should generate milestones with proper structure', () => {
      const milestones = generator.generateMilestones('beginner', 'development', '6-months');
      
      expect(Array.isArray(milestones)).toBe(true);
      expect(milestones.length).toBeGreaterThan(0);
      
      milestones.forEach(milestone => {
        expect(milestone.id).toBeDefined();
        expect(milestone.name).toBeDefined();
        expect(milestone.description).toBeDefined();
        expect(milestone.verification).toBeDefined();
        expect(milestone.rewards).toBeDefined();
        expect(milestone.completed).toBe(false);
      });
    });

    it('should throw error for unknown path', () => {
      expect(() => generator.generateMilestones('beginner', 'unknown', '6-months'))
        .toThrow('No milestone template for path: unknown');
    });
  });

  describe('Resource Recommendation', () => {
    it('should recommend resources based on skills and path', () => {
      const skills = ['meshjs', 'nft'];
      const resources = generator.getRecommendedResources(skills, 'development');
      
      expect(Array.isArray(resources)).toBe(true);
      expect(resources.length).toBeGreaterThan(0);
      expect(resources.length).toBeLessThanOrEqual(10);
      
      resources.forEach(resource => {
        expect(resource.title).toBeDefined();
        expect(resource.description).toBeDefined();
        expect(resource.url).toBeDefined();
        expect(resource.type).toBeDefined();
      });
    });
  });

  describe('Helper Methods', () => {
    it('should calculate correct target levels', () => {
      expect(generator._getTargetLevel('beginner', '6-months')).toBe('intermediate');
      expect(generator._getTargetLevel('intermediate', '6-months')).toBe('advanced');
      expect(generator._getTargetLevel('advanced', '12-months')).toBe('advanced');
    });

    it('should provide timeline multipliers', () => {
      expect(generator._getTimelineMultiplier('3-months')).toBe(0.75);
      expect(generator._getTimelineMultiplier('6-months')).toBe(1.0);
      expect(generator._getTimelineMultiplier('12-months')).toBe(1.5);
    });

    it('should calculate completion dates', () => {
      const completionDate = generator._calculateCompletionDate('6-months');
      const date = new Date(completionDate);
      const now = new Date();
      
      expect(date).toBeInstanceOf(Date);
      expect(date.getTime()).toBeGreaterThan(now.getTime());
    });
  });
});