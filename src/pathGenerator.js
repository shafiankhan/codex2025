/**
 * Career Path Generator for Cardano Career Navigator
 * Creates personalized learning roadmaps based on user profiles
 */

export class CareerPathGenerator {
  constructor(config) {
    this.config = config;
    this.learningPaths = this._initializeLearningPaths();
    this.resources = this._initializeResources();
    this.milestoneTemplates = this._initializeMilestoneTemplates();
  }

  /**
   * Generate a personalized career path based on user profile and timeline
   */
  async generateCareerPath(userProfile, timeline) {
    try {
      console.log(`🗺️ Generating ${timeline} career path for ${userProfile.preferredPath} track...`);
      
      const learningPath = this.generateLearningPath(
        userProfile.preferredPath, 
        userProfile.experienceLevel, 
        timeline
      );
      
      const milestones = this.generateMilestones(
        userProfile.experienceLevel,
        userProfile.preferredPath,
        timeline
      );
      
      const recommendedResources = this.getRecommendedResources(
        userProfile.technicalSkills,
        userProfile.preferredPath
      );
      
      const roadmap = {
        timeline,
        currentLevel: userProfile.experienceLevel,
        targetLevel: this._getTargetLevel(userProfile.experienceLevel, timeline),
        preferredPath: userProfile.preferredPath,
        learningPath,
        milestones,
        recommendedResources,
        estimatedCompletionDate: this._calculateCompletionDate(timeline),
        createdAt: Date.now(),
        userProfile: {
          address: userProfile.address,
          experienceLevel: userProfile.experienceLevel,
          technicalSkills: userProfile.technicalSkills,
          interests: userProfile.interests,
          learningStyle: userProfile.learningStyle
        }
      };
      
      console.log(`✅ Generated roadmap with ${milestones.length} milestones`);
      return roadmap;
      
    } catch (error) {
      console.error('❌ Career path generation failed:', error.message);
      throw new Error(`Career path generation failed: ${error.message}`);
    }
  }

  /**
   * Generate learning path steps based on path, level, and timeline
   */
  generateLearningPath(path, level, timeline) {
    const pathTemplate = this.learningPaths[path];
    if (!pathTemplate) {
      throw new Error(`Unknown career path: ${path}`);
    }
    
    const levelSteps = pathTemplate[level] || pathTemplate.beginner;
    const timelineMultiplier = this._getTimelineMultiplier(timeline);
    
    return levelSteps.map((step, index) => ({
      id: `${path}-${level}-${index + 1}`,
      title: step.title,
      description: step.description,
      category: step.category,
      difficulty: step.difficulty,
      estimatedTime: this._adjustTimeForTimeline(step.estimatedTime, timelineMultiplier),
      prerequisites: step.prerequisites || [],
      skills: step.skills || [],
      deliverables: step.deliverables || []
    }));
  }

  /**
   * Generate milestones with verification steps and timeframes
   */
  generateMilestones(level, path, timeline) {
    const milestoneTemplate = this.milestoneTemplates[path];
    if (!milestoneTemplate) {
      throw new Error(`No milestone template for path: ${path}`);
    }
    
    const levelMilestones = milestoneTemplate[level] || milestoneTemplate.beginner;
    const timelineWeeks = this._getTimelineWeeks(timeline);
    const milestoneInterval = Math.floor(timelineWeeks / levelMilestones.length);
    
    return levelMilestones.map((milestone, index) => ({
      id: `milestone-${path}-${index + 1}`,
      name: milestone.name,
      description: milestone.description,
      category: milestone.category,
      targetWeek: (index + 1) * milestoneInterval,
      estimatedDate: this._calculateMilestoneDate((index + 1) * milestoneInterval),
      verification: milestone.verification,
      requirements: milestone.requirements,
      rewards: {
        nft: milestone.rewards?.nft || false,
        esim: milestone.rewards?.esim || null,
        ada: milestone.rewards?.ada || 0
      },
      nextSteps: milestone.nextSteps || [],
      completed: false
    }));
  }

  /**
   * Get recommended resources based on skills and path
   */
  getRecommendedResources(skills, path) {
    const pathResources = this.resources[path] || [];
    const skillResources = [];
    
    // Add skill-specific resources
    skills.forEach(skill => {
      if (this.resources.skills[skill]) {
        skillResources.push(...this.resources.skills[skill]);
      }
    });
    
    // Combine and deduplicate resources
    const allResources = [...pathResources, ...skillResources];
    const uniqueResources = allResources.filter((resource, index, self) => 
      index === self.findIndex(r => r.title === resource.title)
    );
    
    // Sort by priority and relevance
    return uniqueResources
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, 10); // Limit to top 10 resources
  }

  /**
   * Initialize learning path templates
   */
  _initializeLearningPaths() {
    return {
      development: {
        beginner: [
          {
            title: 'Cardano Fundamentals',
            description: 'Learn basic Cardano concepts: UTXOs, addresses, transactions, and native tokens',
            category: 'theory',
            difficulty: 'beginner',
            estimatedTime: '2 weeks',
            skills: ['cardano-basics', 'utxo-model'],
            deliverables: ['Complete Cardano Academy basics course', 'Set up testnet wallet']
          },
          {
            title: 'Development Environment Setup',
            description: 'Install and configure tools for Cardano development',
            category: 'setup',
            difficulty: 'beginner',
            estimatedTime: '1 week',
            prerequisites: ['Cardano Fundamentals'],
            skills: ['development-tools', 'environment-setup'],
            deliverables: ['Working development environment', 'First transaction on testnet']
          },
          {
            title: 'MeshJS Introduction',
            description: 'Learn to interact with Cardano using MeshJS library',
            category: 'practical',
            difficulty: 'beginner',
            estimatedTime: '3 weeks',
            prerequisites: ['Development Environment Setup'],
            skills: ['meshjs', 'javascript', 'cardano-interaction'],
            deliverables: ['Simple wallet connection app', 'Transaction building example']
          },
          {
            title: 'First dApp Development',
            description: 'Build your first decentralized application on Cardano',
            category: 'project',
            difficulty: 'intermediate',
            estimatedTime: '4 weeks',
            prerequisites: ['MeshJS Introduction'],
            skills: ['dapp-development', 'frontend', 'smart-contracts'],
            deliverables: ['Working dApp', 'Deployed on testnet', 'Documentation']
          }
        ],
        intermediate: [
          {
            title: 'Advanced MeshJS Patterns',
            description: 'Master complex transaction building and multi-sig operations',
            category: 'advanced',
            difficulty: 'intermediate',
            estimatedTime: '3 weeks',
            skills: ['advanced-meshjs', 'multi-sig', 'complex-transactions'],
            deliverables: ['Multi-sig wallet implementation', 'Batch transaction system']
          },
          {
            title: 'Smart Contract Integration',
            description: 'Learn to integrate with Plutus smart contracts using Aiken',
            category: 'smart-contracts',
            difficulty: 'intermediate',
            estimatedTime: '4 weeks',
            skills: ['aiken', 'plutus', 'smart-contract-integration'],
            deliverables: ['Smart contract interaction library', 'Test suite']
          },
          {
            title: 'DeFi Protocol Development',
            description: 'Build decentralized finance applications on Cardano',
            category: 'defi',
            difficulty: 'advanced',
            estimatedTime: '6 weeks',
            prerequisites: ['Smart Contract Integration'],
            skills: ['defi-development', 'liquidity-pools', 'yield-farming'],
            deliverables: ['DeFi protocol', 'Audit report', 'User interface']
          }
        ],
        advanced: [
          {
            title: 'Protocol Contribution',
            description: 'Contribute to core Cardano protocols and infrastructure',
            category: 'protocol',
            difficulty: 'advanced',
            estimatedTime: '8 weeks',
            skills: ['protocol-development', 'haskell', 'consensus-algorithms'],
            deliverables: ['Protocol improvement proposal', 'Implementation', 'Testing']
          }
        ]
      },
      design: {
        beginner: [
          {
            title: 'Cardano UX Fundamentals',
            description: 'Understand unique UX challenges and opportunities in Cardano dApps',
            category: 'theory',
            difficulty: 'beginner',
            estimatedTime: '2 weeks',
            skills: ['cardano-ux', 'wallet-integration', 'user-research'],
            deliverables: ['UX analysis of popular Cardano dApps', 'User journey maps']
          },
          {
            title: 'Design System for Web3',
            description: 'Create design systems optimized for blockchain applications',
            category: 'design-systems',
            difficulty: 'beginner',
            estimatedTime: '3 weeks',
            skills: ['design-systems', 'component-libraries', 'accessibility'],
            deliverables: ['Cardano dApp design system', 'Component library']
          },
          {
            title: 'NFT Collection Design',
            description: 'Design and launch an NFT collection on Cardano',
            category: 'nft',
            difficulty: 'intermediate',
            estimatedTime: '4 weeks',
            prerequisites: ['Design System for Web3'],
            skills: ['nft-design', 'metadata-standards', 'collection-planning'],
            deliverables: ['NFT collection', 'Minting website', 'Marketing materials']
          }
        ],
        intermediate: [
          {
            title: 'Advanced dApp UI/UX',
            description: 'Design complex user interfaces for DeFi and governance applications',
            category: 'advanced-ui',
            difficulty: 'intermediate',
            estimatedTime: '4 weeks',
            skills: ['complex-ui', 'defi-ux', 'governance-interfaces'],
            deliverables: ['DeFi application design', 'Governance portal mockups']
          }
        ]
      },
      community: {
        beginner: [
          {
            title: 'Cardano Governance Basics',
            description: 'Learn about Cardano governance, voting, and delegation',
            category: 'governance',
            difficulty: 'beginner',
            estimatedTime: '2 weeks',
            skills: ['governance', 'voting', 'delegation'],
            deliverables: ['Participate in governance vote', 'Delegate to DRep']
          },
          {
            title: 'Community Building',
            description: 'Learn to build and manage Cardano communities',
            category: 'community',
            difficulty: 'beginner',
            estimatedTime: '3 weeks',
            skills: ['community-management', 'social-media', 'event-planning'],
            deliverables: ['Community growth plan', 'Event organization']
          },
          {
            title: 'Educational Content Creation',
            description: 'Create educational content about Cardano for newcomers',
            category: 'education',
            difficulty: 'intermediate',
            estimatedTime: '4 weeks',
            prerequisites: ['Community Building'],
            skills: ['content-creation', 'technical-writing', 'video-production'],
            deliverables: ['Educational video series', 'Written tutorials']
          }
        ],
        intermediate: [
          {
            title: 'Catalyst Proposal Writing',
            description: 'Master the art of writing successful Project Catalyst proposals',
            category: 'catalyst',
            difficulty: 'intermediate',
            estimatedTime: '3 weeks',
            skills: ['proposal-writing', 'project-management', 'budgeting'],
            deliverables: ['Catalyst proposal', 'Community feedback integration']
          }
        ]
      },
      research: {
        beginner: [
          {
            title: 'Cardano Research Papers',
            description: 'Study the academic foundations of Cardano protocols',
            category: 'academic',
            difficulty: 'beginner',
            estimatedTime: '4 weeks',
            skills: ['academic-research', 'protocol-analysis', 'peer-review'],
            deliverables: ['Research paper summaries', 'Protocol comparison analysis']
          },
          {
            title: 'Technical Writing',
            description: 'Learn to write clear technical documentation and articles',
            category: 'writing',
            difficulty: 'beginner',
            estimatedTime: '3 weeks',
            skills: ['technical-writing', 'documentation', 'communication'],
            deliverables: ['Technical blog posts', 'Documentation improvements']
          }
        ],
        intermediate: [
          {
            title: 'Protocol Research',
            description: 'Conduct original research on Cardano protocol improvements',
            category: 'research',
            difficulty: 'advanced',
            estimatedTime: '8 weeks',
            skills: ['original-research', 'protocol-design', 'formal-methods'],
            deliverables: ['Research proposal', 'Prototype implementation', 'Academic paper']
          }
        ]
      }
    };
  }

  /**
   * Initialize milestone templates
   */
  _initializeMilestoneTemplates() {
    return {
      development: {
        beginner: [
          {
            name: 'Cardano Fundamentals Mastery',
            description: 'Complete understanding of basic Cardano concepts',
            category: 'knowledge',
            verification: 'Pass Cardano fundamentals quiz with 80% score',
            requirements: ['Complete Cardano Academy course', 'Set up testnet wallet'],
            rewards: { nft: true, esim: { data: '1GB', duration: '30 days' } },
            nextSteps: ['Start development environment setup', 'Join developer community']
          },
          {
            name: 'Development Environment Ready',
            description: 'Fully configured development environment for Cardano',
            category: 'setup',
            verification: 'Successfully build and run a sample MeshJS application',
            requirements: ['Install Node.js and development tools', 'Configure testnet access'],
            rewards: { nft: false, esim: null },
            nextSteps: ['Begin MeshJS tutorials', 'Connect with mentor']
          },
          {
            name: 'First dApp Deployed',
            description: 'Successfully deploy your first Cardano dApp',
            category: 'project',
            verification: 'Deploy working dApp to testnet with transaction functionality',
            requirements: ['Complete MeshJS course', 'Build wallet connection', 'Implement transactions'],
            rewards: { nft: true, esim: { data: '2GB', duration: '30 days' }, ada: 5 },
            nextSteps: ['Explore advanced MeshJS features', 'Consider smart contract integration']
          }
        ],
        intermediate: [
          {
            name: 'Advanced Developer',
            description: 'Master complex Cardano development patterns',
            category: 'advanced',
            verification: 'Build multi-sig wallet with batch transactions',
            requirements: ['Advanced MeshJS patterns', 'Smart contract integration'],
            rewards: { nft: true, esim: { data: '5GB', duration: '60 days' }, ada: 10 },
            nextSteps: ['Contribute to open source projects', 'Mentor other developers']
          }
        ]
      },
      design: {
        beginner: [
          {
            name: 'Cardano UX Expert',
            description: 'Deep understanding of Cardano user experience principles',
            category: 'knowledge',
            verification: 'Create comprehensive UX analysis of 3 major Cardano dApps',
            requirements: ['Complete UX research', 'Design user journey maps'],
            rewards: { nft: true, esim: { data: '1GB', duration: '30 days' } },
            nextSteps: ['Start design system creation', 'Join design community']
          },
          {
            name: 'NFT Collection Launch',
            description: 'Successfully launch an NFT collection on Cardano',
            category: 'project',
            verification: 'Launch NFT collection with at least 100 mints',
            requirements: ['Design collection', 'Build minting website', 'Execute marketing'],
            rewards: { nft: true, esim: { data: '3GB', duration: '60 days' }, ada: 15 },
            nextSteps: ['Explore advanced design patterns', 'Consider DeFi UI design']
          }
        ]
      },
      community: {
        beginner: [
          {
            name: 'Governance Participant',
            description: 'Active participant in Cardano governance',
            category: 'governance',
            verification: 'Participate in 3 governance votes and delegate to DRep',
            requirements: ['Learn governance mechanisms', 'Engage with community'],
            rewards: { nft: true, esim: { data: '1GB', duration: '30 days' } },
            nextSteps: ['Consider becoming a DRep', 'Write governance content']
          },
          {
            name: 'Community Leader',
            description: 'Established leader in Cardano community',
            category: 'leadership',
            verification: 'Organize community event with 50+ participants',
            requirements: ['Build community following', 'Create educational content'],
            rewards: { nft: true, esim: { data: '5GB', duration: '90 days' }, ada: 20 },
            nextSteps: ['Apply for Catalyst funding', 'Mentor new community members']
          }
        ]
      },
      research: {
        beginner: [
          {
            name: 'Research Foundation',
            description: 'Strong foundation in Cardano research and protocols',
            category: 'knowledge',
            verification: 'Publish 3 technical blog posts with peer review',
            requirements: ['Study research papers', 'Write technical content'],
            rewards: { nft: true, esim: { data: '2GB', duration: '60 days' } },
            nextSteps: ['Begin original research', 'Collaborate with researchers']
          }
        ]
      }
    };
  }

  /**
   * Initialize resource library
   */
  _initializeResources() {
    return {
      development: [
        {
          title: 'MeshJS Documentation',
          description: 'Official MeshJS library documentation and tutorials',
          url: 'https://meshjs.dev',
          type: 'documentation',
          priority: 10,
          tags: ['meshjs', 'javascript', 'cardano']
        },
        {
          title: 'Cardano Developer Portal',
          description: 'Official Cardano developer resources and guides',
          url: 'https://developers.cardano.org',
          type: 'documentation',
          priority: 10,
          tags: ['cardano', 'development', 'official']
        },
        {
          title: 'Aiken Language Guide',
          description: 'Learn Aiken for smart contract development',
          url: 'https://aiken-lang.org',
          type: 'documentation',
          priority: 8,
          tags: ['aiken', 'smart-contracts', 'plutus']
        }
      ],
      design: [
        {
          title: 'Cardano Design System',
          description: 'Design patterns and components for Cardano applications',
          url: 'https://www.figma.com/community/cardano-design-system',
          type: 'design-system',
          priority: 9,
          tags: ['design', 'ui-ux', 'components']
        },
        {
          title: 'NFT Metadata Standards',
          description: 'CIP-25 and other NFT metadata standards for Cardano',
          url: 'https://cips.cardano.org/cips/cip25/',
          type: 'specification',
          priority: 8,
          tags: ['nft', 'metadata', 'standards']
        }
      ],
      community: [
        {
          title: 'Project Catalyst Guide',
          description: 'Complete guide to participating in Project Catalyst',
          url: 'https://projectcatalyst.io',
          type: 'guide',
          priority: 10,
          tags: ['catalyst', 'governance', 'funding']
        },
        {
          title: 'Cardano Community Hub',
          description: 'Central hub for Cardano community resources',
          url: 'https://cardano.org/community',
          type: 'community',
          priority: 9,
          tags: ['community', 'events', 'networking']
        }
      ],
      research: [
        {
          title: 'IOHK Research Library',
          description: 'Academic papers and research from IOHK',
          url: 'https://iohk.io/research/library/',
          type: 'academic',
          priority: 10,
          tags: ['research', 'academic', 'protocols']
        },
        {
          title: 'Cardano Improvement Proposals',
          description: 'Technical specifications and improvement proposals',
          url: 'https://cips.cardano.org',
          type: 'specification',
          priority: 9,
          tags: ['cips', 'specifications', 'improvements']
        }
      ],
      skills: {
        'meshjs': [
          {
            title: 'MeshJS Tutorials',
            description: 'Step-by-step MeshJS tutorials for beginners',
            url: 'https://meshjs.dev/tutorials',
            type: 'tutorial',
            priority: 10,
            tags: ['meshjs', 'tutorial', 'beginner']
          }
        ],
        'nft': [
          {
            title: 'NFT Creation Guide',
            description: 'Complete guide to creating NFTs on Cardano',
            url: 'https://developers.cardano.org/docs/native-tokens/minting-nfts',
            type: 'guide',
            priority: 9,
            tags: ['nft', 'minting', 'native-tokens']
          }
        ],
        'defi': [
          {
            title: 'DeFi Development Patterns',
            description: 'Common patterns for DeFi development on Cardano',
            url: 'https://github.com/cardano-defi-patterns',
            type: 'code-examples',
            priority: 8,
            tags: ['defi', 'patterns', 'development']
          }
        ]
      }
    };
  }

  /**
   * Helper methods
   */
  _getTargetLevel(currentLevel, timeline) {
    const levelProgression = {
      'beginner': { '3-months': 'beginner', '6-months': 'intermediate', '12-months': 'intermediate' },
      'intermediate': { '3-months': 'intermediate', '6-months': 'advanced', '12-months': 'advanced' },
      'advanced': { '3-months': 'advanced', '6-months': 'advanced', '12-months': 'advanced' }
    };
    
    return levelProgression[currentLevel]?.[timeline] || 'intermediate';
  }

  _getTimelineMultiplier(timeline) {
    const multipliers = {
      '3-months': 0.75,  // Accelerated pace
      '6-months': 1.0,   // Standard pace
      '12-months': 1.5   // Relaxed pace with more depth
    };
    return multipliers[timeline] || 1.0;
  }

  _getTimelineWeeks(timeline) {
    const weeks = {
      '3-months': 12,
      '6-months': 24,
      '12-months': 48
    };
    return weeks[timeline] || 24;
  }

  _adjustTimeForTimeline(estimatedTime, multiplier) {
    // Simple time adjustment - in a real implementation, this would be more sophisticated
    const timeValue = parseInt(estimatedTime);
    const unit = estimatedTime.replace(/\d+\s*/, '');
    const adjustedTime = Math.ceil(timeValue * multiplier);
    return `${adjustedTime} ${unit}`;
  }

  _calculateCompletionDate(timeline) {
    const now = new Date();
    const months = {
      '3-months': 3,
      '6-months': 6,
      '12-months': 12
    };
    
    const targetDate = new Date(now);
    targetDate.setMonth(targetDate.getMonth() + (months[timeline] || 6));
    return targetDate.toISOString();
  }

  _calculateMilestoneDate(weekOffset) {
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + (weekOffset * 7));
    return targetDate.toISOString();
  }
}

/**
 * Career Roadmap Interface (for documentation)
 */
export const CareerRoadmapSchema = {
  timeline: '3-months | 6-months | 12-months',
  currentLevel: 'beginner | intermediate | advanced',
  targetLevel: 'beginner | intermediate | advanced',
  preferredPath: 'development | design | community | research',
  learningPath: 'LearningStep[]',
  milestones: 'Milestone[]',
  recommendedResources: 'Resource[]',
  estimatedCompletionDate: 'string (ISO date)',
  createdAt: 'number (timestamp)',
  userProfile: 'UserProfile'
};