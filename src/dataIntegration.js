/**
 * Data Integration for Cardano Career Navigator
 * Handles external API calls for Project Catalyst and bounty data
 */

import axios from 'axios';

export class DataIntegration {
  constructor(config) {
    this.config = config;
    this.cache = new Map();
    this.cacheTimeout = config.app.cacheTimeout || 300000; // 5 minutes default
    this.retryAttempts = config.app.retryAttempts || 3;
    
    // Initialize axios instance with default config
    this.httpClient = axios.create({
      timeout: config.apis?.catalyst?.timeout || 10000,
      headers: {
        'User-Agent': `${config.app.name}/${config.app.version}`,
        'Accept': 'application/json'
      }
    });
    
    // Setup request/response interceptors
    this._setupInterceptors();
  }

  /**
   * Get active Project Catalyst rounds with filtering
   */
  async getActiveCatalystRounds() {
    const cacheKey = 'catalyst_rounds';
    
    try {
      console.log('🔍 Fetching active Catalyst rounds...');
      
      // Check cache first
      const cached = this._getFromCache(cacheKey);
      if (cached) {
        console.log('📋 Using cached Catalyst data');
        return cached;
      }
      
      // In development mode, return mock data
      if (this.config.development.enableMockData) {
        const mockData = this._getMockCatalystRounds();
        this._setCache(cacheKey, mockData);
        console.log(`✅ Retrieved ${mockData.length} mock Catalyst rounds`);
        return mockData;
      }
      
      // Fetch from real API (placeholder for when API is available)
      const rounds = await this._fetchCatalystRoundsFromAPI();
      this._setCache(cacheKey, rounds);
      
      console.log(`✅ Retrieved ${rounds.length} active Catalyst rounds`);
      return rounds;
      
    } catch (error) {
      console.warn('⚠️ Failed to fetch Catalyst rounds, using fallback data:', error.message);
      return this._getFallbackCatalystData();
    }
  }

  /**
   * Get relevant bounties based on user skills
   */
  async getRelevantBounties(skills = []) {
    // Ensure skills is always an array
    const skillsArray = Array.isArray(skills) ? skills : [];
    const cacheKey = `bounties_${skillsArray.sort().join('_')}`;
    
    try {
      console.log(`🎯 Fetching bounties for skills: ${skillsArray.join(', ')}`);
      
      // Check cache first
      const cached = this._getFromCache(cacheKey);
      if (cached) {
        console.log('📋 Using cached bounty data');
        return cached;
      }
      
      // Get all bounties
      const allBounties = await this._getAllBounties();
      
      // Filter by skills
      const relevantBounties = this._filterBountiesBySkills(allBounties, skillsArray);
      
      // Sort by relevance and deadline
      const sortedBounties = this._sortBountiesByRelevance(relevantBounties, skillsArray);
      
      this._setCache(cacheKey, sortedBounties);
      console.log(`✅ Found ${sortedBounties.length} relevant bounties`);
      
      return sortedBounties;
      
    } catch (error) {
      console.warn('⚠️ Failed to fetch bounties, using fallback data:', error.message);
      return this._getFallbackBountyData(skillsArray);
    }
  }

  /**
   * Get Cardano ecosystem metrics and data
   */
  async getCardanoMetrics() {
    const cacheKey = 'cardano_metrics';
    
    try {
      // Check cache first
      const cached = this._getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
      
      // In development, return mock metrics
      if (this.config.development.enableMockData) {
        const mockMetrics = this._getMockCardanoMetrics();
        this._setCache(cacheKey, mockMetrics);
        return mockMetrics;
      }
      
      // TODO: Implement real metrics fetching when APIs are available
      const metrics = await this._fetchCardanoMetricsFromAPI();
      this._setCache(cacheKey, metrics);
      
      return metrics;
      
    } catch (error) {
      console.warn('⚠️ Failed to fetch Cardano metrics:', error.message);
      return this._getFallbackMetricsData();
    }
  }

  /**
   * Validate Cardano address format
   */
  validateCardanoAddress(address) {
    if (!address || typeof address !== 'string') {
      return false;
    }
    
    // Basic Cardano address validation
    return address.length >= 50 && (
      address.startsWith('addr1') || // Mainnet
      address.startsWith('addr_test1') || // Testnet
      address.startsWith('stake1') || // Mainnet stake
      address.startsWith('stake_test1') // Testnet stake
    );
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      timeout: this.cacheTimeout
    };
  }

  // Private methods

  /**
   * Setup axios interceptors for logging and error handling
   */
  _setupInterceptors() {
    // Request interceptor
    this.httpClient.interceptors.request.use(
      (config) => {
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.httpClient.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`❌ API Error: ${error.response?.status || 'Network'} ${error.config?.url}`);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch Catalyst rounds from API (placeholder implementation)
   */
  async _fetchCatalystRoundsFromAPI() {
    try {
      // TODO: Replace with actual Catalyst API when available
      // const response = await this.httpClient.get(`${this.config.apis.catalyst.baseUrl}/rounds`);
      // return response.data;
      
      // For now, simulate API call and return mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return this._getMockCatalystRounds();
      
    } catch (error) {
      throw new Error(`Failed to fetch Catalyst rounds: ${error.message}`);
    }
  }

  /**
   * Get all available bounties
   */
  async _getAllBounties() {
    if (this.config.development.enableMockData) {
      return this._getMockBounties();
    }
    
    // TODO: Implement real bounty API integration
    // For now, return mock data
    return this._getMockBounties();
  }

  /**
   * Filter bounties by user skills
   */
  _filterBountiesBySkills(bounties, skills) {
    if (!skills || skills.length === 0) {
      return bounties.slice(0, 10); // Return top 10 if no skills specified
    }
    
    return bounties.filter(bounty => {
      const bountySkills = bounty.requiredSkills || [];
      const bountyTags = bounty.tags || [];
      const allBountyTerms = [...bountySkills, ...bountyTags].map(s => s.toLowerCase());
      
      // Check if user has any of the required skills
      return skills.some(skill => 
        allBountyTerms.some(term => 
          term.includes(skill.toLowerCase()) || skill.toLowerCase().includes(term)
        )
      );
    });
  }

  /**
   * Sort bounties by relevance to user skills
   */
  _sortBountiesByRelevance(bounties, skills) {
    return bounties
      .map(bounty => ({
        ...bounty,
        relevanceScore: this._calculateBountyRelevance(bounty, skills)
      }))
      .sort((a, b) => {
        // Sort by relevance score first, then by reward amount, then by deadline
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        if (b.reward !== a.reward) {
          return b.reward - a.reward;
        }
        return new Date(a.deadline) - new Date(b.deadline);
      })
      .slice(0, 10); // Return top 10 most relevant
  }

  /**
   * Calculate bounty relevance score based on user skills
   */
  _calculateBountyRelevance(bounty, skills) {
    let score = 0;
    const bountySkills = bounty.requiredSkills || [];
    const bountyTags = bounty.tags || [];
    const allBountyTerms = [...bountySkills, ...bountyTags].map(s => s.toLowerCase());
    
    skills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      allBountyTerms.forEach(term => {
        if (term === skillLower) {
          score += 10; // Exact match
        } else if (term.includes(skillLower) || skillLower.includes(term)) {
          score += 5; // Partial match
        }
      });
    });
    
    // Bonus for higher rewards
    score += Math.min(bounty.reward / 1000, 5); // Up to 5 bonus points for high rewards
    
    // Penalty for urgent deadlines (less than 30 days)
    const daysUntilDeadline = (new Date(bounty.deadline) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysUntilDeadline < 30) {
      score -= 2;
    }
    
    return score;
  }

  /**
   * Fetch Cardano metrics from API (placeholder)
   */
  async _fetchCardanoMetricsFromAPI() {
    // TODO: Implement real metrics API integration
    return this._getMockCardanoMetrics();
  }

  /**
   * Cache management methods
   */
  _getFromCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const { data, timestamp } = cached;
    const now = Date.now();
    
    if (now - timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }
    
    return data;
  }

  _setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Mock data generators for development and testing
   */
  _getMockCatalystRounds() {
    return [
      {
        id: 'fund12',
        name: 'Project Catalyst Fund 12',
        status: 'active',
        totalBudget: 50000000, // 50M ADA
        categories: [
          {
            id: 'cardano-open-developers',
            name: 'Cardano Open: Developers',
            budget: 15000000,
            description: 'Tools, infrastructure, and resources for Cardano developers',
            requiredSkills: ['development', 'smart-contracts', 'cardano', 'plutus', 'aiken'],
            minProposalBudget: 15000,
            maxProposalBudget: 200000
          },
          {
            id: 'cardano-open-ecosystem',
            name: 'Cardano Open: Ecosystem',
            budget: 10000000,
            description: 'Projects that enhance the Cardano ecosystem',
            requiredSkills: ['community', 'marketing', 'business-development'],
            minProposalBudget: 15000,
            maxProposalBudget: 150000
          },
          {
            id: 'catalyst-systems-improvements',
            name: 'Catalyst Systems Improvements',
            budget: 5000000,
            description: 'Improvements to the Catalyst voting and governance system',
            requiredSkills: ['governance', 'development', 'ux-design'],
            minProposalBudget: 50000,
            maxProposalBudget: 500000
          }
        ],
        timeline: {
          proposalSubmission: '2024-03-15T00:00:00Z',
          communityReview: '2024-04-01T00:00:00Z',
          voting: '2024-04-15T00:00:00Z',
          results: '2024-05-01T00:00:00Z'
        },
        requirements: {
          minExperience: 'intermediate',
          proposalFormat: 'structured',
          communityEngagement: true
        }
      },
      {
        id: 'fund11-special',
        name: 'Fund 11 Special Categories',
        status: 'planning',
        totalBudget: 20000000,
        categories: [
          {
            id: 'defi-and-tokenization',
            name: 'DeFi and Tokenization',
            budget: 8000000,
            description: 'DeFi protocols and tokenization solutions on Cardano',
            requiredSkills: ['defi', 'smart-contracts', 'tokenization', 'liquidity'],
            minProposalBudget: 25000,
            maxProposalBudget: 300000
          }
        ],
        timeline: {
          proposalSubmission: '2024-05-15T00:00:00Z',
          communityReview: '2024-06-01T00:00:00Z',
          voting: '2024-06-15T00:00:00Z',
          results: '2024-07-01T00:00:00Z'
        }
      }
    ];
  }

  _getMockBounties() {
    return [
      {
        id: 'meshjs-tutorial-series',
        title: 'MeshJS Tutorial Series',
        description: 'Create comprehensive video tutorials for MeshJS library covering wallet integration, transaction building, and smart contract interaction',
        organization: 'MeshJS Community',
        reward: 5000, // ADA
        deadline: '2024-04-30T23:59:59Z',
        status: 'open',
        difficulty: 'intermediate',
        requiredSkills: ['meshjs', 'javascript', 'tutorial-creation', 'video-production'],
        tags: ['education', 'development', 'community'],
        requirements: [
          'Experience with MeshJS library',
          'Video production skills',
          'Clear English communication',
          'Portfolio of previous tutorials'
        ],
        deliverables: [
          '10 video tutorials (15-20 minutes each)',
          'Code examples and documentation',
          'Interactive demos'
        ],
        contact: 'bounties@meshjs.dev'
      },
      {
        id: 'cardano-nft-marketplace-ui',
        title: 'NFT Marketplace UI/UX Design',
        description: 'Design modern, accessible UI/UX for a new Cardano NFT marketplace with focus on user experience and Begin Wallet integration',
        organization: 'Cardano NFT Collective',
        reward: 8000,
        deadline: '2024-05-15T23:59:59Z',
        status: 'open',
        difficulty: 'intermediate',
        requiredSkills: ['ui-design', 'ux-design', 'nft', 'figma', 'accessibility'],
        tags: ['design', 'nft', 'marketplace'],
        requirements: [
          'Portfolio of Web3/NFT designs',
          'Figma proficiency',
          'Understanding of Cardano NFT standards',
          'Accessibility compliance knowledge'
        ],
        deliverables: [
          'Complete UI/UX design in Figma',
          'Design system and components',
          'Prototype with interactions',
          'Accessibility audit report'
        ],
        contact: 'design@cardanonft.collective'
      },
      {
        id: 'defi-yield-calculator',
        title: 'DeFi Yield Calculator Tool',
        description: 'Build a comprehensive yield calculator for Cardano DeFi protocols including staking, liquidity provision, and lending',
        organization: 'Cardano DeFi Alliance',
        reward: 12000,
        deadline: '2024-06-01T23:59:59Z',
        status: 'open',
        difficulty: 'advanced',
        requiredSkills: ['defi', 'javascript', 'react', 'api-integration', 'financial-modeling'],
        tags: ['defi', 'tools', 'development'],
        requirements: [
          'Strong DeFi protocol knowledge',
          'React/Next.js experience',
          'API integration skills',
          'Financial modeling experience'
        ],
        deliverables: [
          'Web application with yield calculations',
          'Integration with major Cardano DeFi protocols',
          'Historical data analysis',
          'Mobile-responsive design'
        ],
        contact: 'dev@cardanodefi.alliance'
      },
      {
        id: 'governance-participation-guide',
        title: 'Cardano Governance Participation Guide',
        description: 'Create comprehensive guide for new users to participate in Cardano governance, including DRep delegation and voting',
        organization: 'Cardano Foundation',
        reward: 3000,
        deadline: '2024-04-15T23:59:59Z',
        status: 'open',
        difficulty: 'beginner',
        requiredSkills: ['governance', 'technical-writing', 'community', 'education'],
        tags: ['governance', 'education', 'community'],
        requirements: [
          'Deep understanding of Cardano governance',
          'Technical writing experience',
          'Community engagement experience'
        ],
        deliverables: [
          'Written guide (5000+ words)',
          'Video walkthrough',
          'Interactive checklist',
          'FAQ section'
        ],
        contact: 'community@cardanofoundation.org'
      },
      {
        id: 'smart-contract-audit-tool',
        title: 'Plutus Smart Contract Audit Tool',
        description: 'Develop automated tool for basic security auditing of Plutus smart contracts',
        organization: 'Cardano Security Collective',
        reward: 15000,
        deadline: '2024-07-01T23:59:59Z',
        status: 'open',
        difficulty: 'advanced',
        requiredSkills: ['plutus', 'haskell', 'security', 'smart-contracts', 'static-analysis'],
        tags: ['security', 'development', 'tools'],
        requirements: [
          'Expert knowledge of Plutus',
          'Security auditing experience',
          'Haskell programming skills',
          'Static analysis tool development'
        ],
        deliverables: [
          'Command-line audit tool',
          'Web interface',
          'Documentation and examples',
          'Integration with development workflows'
        ],
        contact: 'security@cardano.collective'
      }
    ];
  }

  _getMockCardanoMetrics() {
    return {
      network: {
        currentEpoch: 450,
        totalStaked: 23500000000, // 23.5B ADA
        stakingParticipation: 0.73, // 73%
        totalSupply: 45000000000, // 45B ADA
        circulatingSupply: 35000000000 // 35B ADA
      },
      development: {
        activeDevelopers: 2500,
        githubRepos: 1200,
        smartContracts: 8500,
        nativeTokens: 450000
      },
      ecosystem: {
        dapps: 150,
        nftProjects: 12000,
        defiProtocols: 25,
        exchanges: 45
      },
      catalyst: {
        totalFunded: 150000000, // 150M ADA
        projectsFunded: 1200,
        activeProposers: 5000,
        communityAdvisors: 800
      }
    };
  }

  /**
   * Fallback data methods for when APIs are unavailable
   */
  _getFallbackCatalystData() {
    console.log('📋 Using fallback Catalyst data');
    return [
      {
        id: 'fallback-fund',
        name: 'Catalyst Fund (Cached)',
        status: 'active',
        categories: [
          {
            id: 'general-development',
            name: 'General Development',
            description: 'General development projects for Cardano ecosystem',
            requiredSkills: ['development', 'cardano'],
            budget: 1000000
          }
        ],
        timeline: {
          proposalSubmission: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ];
  }

  _getFallbackBountyData(skills) {
    console.log('📋 Using fallback bounty data');
    return [
      {
        id: 'fallback-bounty',
        title: 'General Cardano Development',
        description: 'General development opportunities in the Cardano ecosystem',
        reward: 1000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        requiredSkills: skills.length > 0 ? skills : ['development'],
        tags: ['development', 'cardano'],
        status: 'open'
      }
    ];
  }

  _getFallbackMetricsData() {
    return {
      network: { currentEpoch: 400, totalStaked: 20000000000 },
      development: { activeDevelopers: 2000 },
      ecosystem: { dapps: 100 },
      catalyst: { totalFunded: 100000000 }
    };
  }
}

/**
 * Data Integration Interfaces (for documentation)
 */
export const CatalystRoundSchema = {
  id: 'string',
  name: 'string',
  status: 'active | planning | completed',
  totalBudget: 'number (ADA)',
  categories: 'CatalystCategory[]',
  timeline: 'CatalystTimeline',
  requirements: 'CatalystRequirements'
};

export const BountySchema = {
  id: 'string',
  title: 'string',
  description: 'string',
  organization: 'string',
  reward: 'number (ADA)',
  deadline: 'string (ISO date)',
  status: 'open | in-progress | completed',
  difficulty: 'beginner | intermediate | advanced',
  requiredSkills: 'string[]',
  tags: 'string[]',
  requirements: 'string[]',
  deliverables: 'string[]',
  contact: 'string'
};