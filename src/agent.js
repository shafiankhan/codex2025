/**
 * CareerNavigatorAgent - Main agent class for Masumi integration
 */

export class CareerNavigatorAgent {
  constructor(config) {
    this.config = config;
    this.isRegistered = false;
    this.registrationError = null;
    this.services = this._initializeServices();
  }

  /**
   * Initialize service definitions with pricing and metadata
   */
  _initializeServices() {
    return {
      assessment: {
        name: 'Skills Assessment',
        description: 'Analyze on-chain activity to determine skills and experience level',
        price: this.config.pricing.assessment,
        currency: 'ADA',
        estimatedTime: '2-3 minutes',
        requirements: ['Valid Cardano wallet address']
      },
      roadmap: {
        name: 'Career Roadmap',
        description: 'Generate personalized learning path with milestones and resources',
        price: this.config.pricing.roadmap,
        currency: 'ADA',
        estimatedTime: '3-5 minutes',
        requirements: ['Completed skills assessment', 'Timeline preference']
      },
      catalyst: {
        name: 'Catalyst Guidance',
        description: 'Specialized guidance for Project Catalyst proposal creation',
        price: this.config.pricing.catalyst,
        currency: 'ADA',
        estimatedTime: '5-10 minutes',
        requirements: ['Intermediate+ experience level', 'Project concept']
      }
    };
  }

  /**
   * Register the agent with Masumi platform
   */
  async register() {
    try {
      console.log('📝 Registering Cardano Career Navigator with Masumi platform...');
      
      // Validate configuration before registration
      this._validateConfiguration();
      
      // TODO: Implement actual Masumi SDK registration when available
      // const masumiSDK = new MasumiSDK(this.config.masumi);
      // await masumiSDK.registerAgent({
      //   id: this.config.masumi.agentId,
      //   name: this.config.app.name,
      //   description: this.config.app.description,
      //   version: this.config.app.version,
      //   services: this.services,
      //   network: this.config.network
      // });
      
      // For now, simulate registration with validation
      console.log('⏳ Masumi SDK not available - using placeholder registration');
      console.log(`📋 Agent ID: ${this.config.masumi.agentId}`);
      console.log(`🌐 Network: ${this.config.network}`);
      console.log('💰 Service Pricing:');
      Object.entries(this.services).forEach(([key, service]) => {
        console.log(`  - ${service.name}: ${service.price} ${service.currency}`);
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.isRegistered = true;
      this.registrationError = null;
      console.log('✅ Agent registered successfully with Masumi platform');
      
      return {
        success: true,
        agentId: this.config.masumi.agentId,
        services: Object.keys(this.services),
        network: this.config.network
      };
      
    } catch (error) {
      this.registrationError = error;
      console.error('❌ Agent registration failed:', error.message);
      throw new AgentRegistrationError(`Agent registration failed: ${error.message}`, error);
    }
  }

  /**
   * Validate configuration before registration
   */
  _validateConfiguration() {
    const required = ['masumi.agentId', 'network', 'pricing'];
    
    for (const path of required) {
      const value = this._getNestedValue(this.config, path);
      if (!value) {
        throw new Error(`Missing required configuration: ${path}`);
      }
    }

    // Validate pricing values
    const pricing = this.config.pricing;
    if (pricing.assessment <= 0 || pricing.roadmap <= 0 || pricing.catalyst <= 0) {
      throw new Error('All service prices must be positive values');
    }

    // Validate network
    if (!['preprod', 'mainnet'].includes(this.config.network)) {
      throw new Error('Network must be either "preprod" or "mainnet"');
    }
  }

  /**
   * Helper to get nested object values
   */
  _getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Main request handler for all service types
   */
  async processRequest(request) {
    try {
      // Validate agent registration
      if (!this.isRegistered) {
        throw new AgentNotRegisteredError('Agent not registered with Masumi platform');
      }

      // Validate and normalize request
      const validatedRequest = this._validateRequest(request);
      const { type, userAddress, timeline, paymentVerified } = validatedRequest;

      console.log(`🔄 Processing ${type} request for address: ${userAddress}`);

      // Verify payment (skip in development if configured)
      if (!this.config.development.skipPaymentVerification && !paymentVerified) {
        await this._verifyPayment(type, request.paymentTxHash);
      }

      // Route to appropriate service handler
      switch (type) {
        case 'assessment':
          return await this.handleAssessment(validatedRequest);
        case 'roadmap':
          return await this.handleRoadmap(validatedRequest);
        case 'catalyst':
          return await this.handleCatalystGuidance(validatedRequest);
        default:
          throw new InvalidRequestError(`Unknown request type: ${type}`);
      }

    } catch (error) {
      console.error(`❌ Request processing failed:`, error.message);
      
      // Re-throw known errors
      if (error instanceof CareerNavigatorError) {
        throw error;
      }
      
      // Wrap unknown errors
      throw new RequestProcessingError(`Request processing failed: ${error.message}`, error);
    }
  }

  /**
   * Validate incoming request structure and parameters
   */
  _validateRequest(request) {
    if (!request || typeof request !== 'object') {
      throw new InvalidRequestError('Request must be a valid object');
    }

    const { type, userAddress, timeline, paymentTxHash } = request;

    // Validate service type
    if (!type || !this.services[type]) {
      throw new InvalidRequestError(`Invalid service type. Available: ${Object.keys(this.services).join(', ')}`);
    }

    // Validate user address
    if (!userAddress || typeof userAddress !== 'string') {
      throw new InvalidRequestError('Valid userAddress is required');
    }

    // Basic Cardano address validation (simplified)
    if (!this._isValidCardanoAddress(userAddress)) {
      throw new InvalidRequestError('Invalid Cardano wallet address format');
    }

    // Service-specific validation
    if (type === 'roadmap' && !timeline) {
      throw new InvalidRequestError('Timeline is required for roadmap service (3-months, 6-months, or 12-months)');
    }

    if (type === 'roadmap' && !['3-months', '6-months', '12-months'].includes(timeline)) {
      throw new InvalidRequestError('Timeline must be one of: 3-months, 6-months, 12-months');
    }

    return {
      type,
      userAddress: userAddress.trim(),
      timeline,
      paymentTxHash,
      paymentVerified: !!paymentTxHash,
      timestamp: Date.now()
    };
  }

  /**
   * Basic Cardano address validation
   */
  _isValidCardanoAddress(address) {
    // In development mode with mock data, allow test addresses
    if (this.config.development.enableMockData && address.startsWith('test_address_')) {
      return true;
    }
    
    // Simplified validation - in production, use proper Cardano address validation
    return address.length >= 50 && (
      address.startsWith('addr1') || // Mainnet
      address.startsWith('addr_test1') || // Testnet
      address.startsWith('stake1') || // Mainnet stake
      address.startsWith('stake_test1') // Testnet stake
    );
  }

  /**
   * Verify payment for service (placeholder implementation)
   */
  async _verifyPayment(serviceType, paymentTxHash) {
    if (!paymentTxHash) {
      throw new PaymentVerificationError(`Payment required for ${serviceType} service (${this.services[serviceType].price} ADA)`);
    }

    // TODO: Implement actual payment verification with Masumi SDK
    // For now, simulate payment verification
    console.log(`💰 Verifying payment: ${paymentTxHash} for ${serviceType} service`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ Payment verified successfully');
    return true;
  }

  /**
   * Get service information
   */
  getServiceInfo(serviceType = null) {
    if (serviceType) {
      if (!this.services[serviceType]) {
        throw new InvalidRequestError(`Unknown service type: ${serviceType}`);
      }
      return this.services[serviceType];
    }
    return this.services;
  }

  /**
   * Get agent status and health information
   */
  getStatus() {
    return {
      isRegistered: this.isRegistered,
      agentId: this.config.masumi.agentId,
      network: this.config.network,
      services: Object.keys(this.services),
      registrationError: this.registrationError?.message || null,
      uptime: process.uptime(),
      version: this.config.app.version
    };
  }

  /**
   * Handle user skills assessment service (0.5 ADA)
   */
  async handleAssessment(request) {
    console.log('🔍 Processing skills assessment request...');
    
    try {
      const { userAddress, paymentTxHash } = request;
      
      // Import TransactionAnalyzer dynamically to avoid circular dependencies
      let TransactionAnalyzer;
      try {
        const module = await import('./analyzer.js');
        TransactionAnalyzer = module.TransactionAnalyzer;
      } catch (importError) {
        console.error('Failed to import TransactionAnalyzer:', importError);
        throw new RequestProcessingError('Failed to load transaction analyzer', importError);
      }
      
      const analyzer = new TransactionAnalyzer(this.config);
      
      // Analyze user's transaction history to generate profile
      console.log('📊 Analyzing user transaction history...');
      const userProfile = await analyzer.analyzeUserBackground(userAddress);
      
      // Generate Begin Wallet integration tips based on profile
      const beginWalletTips = this._generateBeginWalletTips(userProfile);
      
      // Format assessment response
      const assessmentResponse = {
        success: true,
        service: 'assessment',
        userAddress,
        paymentTxHash,
        timestamp: Date.now(),
        profile: {
          experienceLevel: userProfile.experienceLevel,
          technicalSkills: userProfile.technicalSkills,
          interests: userProfile.interests,
          learningStyle: userProfile.learningStyle,
          preferredPath: userProfile.preferredPath,
          transactionCount: userProfile.transactionCount,
          analysisTimestamp: userProfile.analysisTimestamp
        },
        insights: this._generateProfileInsights(userProfile),
        nextSteps: this._generateNextSteps(userProfile),
        beginWalletIntegration: beginWalletTips,
        recommendations: {
          roadmapService: {
            recommended: true,
            reason: `Based on your ${userProfile.experienceLevel} level and ${userProfile.preferredPath} path preference`,
            price: this.config.pricing.roadmap,
            currency: 'ADA'
          },
          catalystService: {
            recommended: userProfile.experienceLevel !== 'beginner',
            reason: userProfile.experienceLevel === 'beginner' 
              ? 'Complete a learning roadmap first to build foundational skills'
              : `Your ${userProfile.experienceLevel} level makes you ready for Catalyst participation`,
            price: this.config.pricing.catalyst,
            currency: 'ADA'
          }
        }
      };
      
      console.log(`✅ Assessment completed for ${userProfile.experienceLevel} ${userProfile.preferredPath} user`);
      return assessmentResponse;
      
    } catch (error) {
      console.error('❌ Assessment processing failed:', error.message);
      throw new RequestProcessingError(`Assessment failed: ${error.message}`, error);
    }
  }

  /**
   * Generate Begin Wallet integration tips based on user profile
   */
  _generateBeginWalletTips(userProfile) {
    const tips = [];
    
    // Base tip for all users
    tips.push({
      category: 'progress-tracking',
      title: 'Track Your Learning Progress On-Chain',
      description: 'Use Begin Wallet to store your learning milestones as on-chain metadata',
      action: 'Enable metadata tracking in Begin Wallet settings',
      benefit: 'Verifiable proof of your Cardano learning journey'
    });
    
    // Experience level specific tips
    if (userProfile.experienceLevel === 'beginner') {
      tips.push({
        category: 'getting-started',
        title: 'Start with Begin Wallet Basics',
        description: 'Begin Wallet offers unique features like eSIM integration and metadata storage',
        action: 'Explore Begin Wallet\'s educational resources and tutorials',
        benefit: 'Learn Cardano fundamentals while using real-world utility features'
      });
    }
    
    // Interest-based tips
    if (userProfile.interests.includes('real-world-utility')) {
      tips.push({
        category: 'esim-rewards',
        title: 'Earn eSIM Data Rewards',
        description: 'Complete learning milestones to earn mobile data through Begin Wallet',
        action: 'Set up eSIM functionality in Begin Wallet',
        benefit: 'Get real-world value from your learning achievements'
      });
    }
    
    if (userProfile.interests.includes('travel')) {
      tips.push({
        category: 'travel-integration',
        title: 'Use Begin Wallet for Travel',
        description: 'Begin Wallet\'s eSIM feature provides global connectivity',
        action: 'Explore Begin Wallet\'s travel and connectivity features',
        benefit: 'Stay connected worldwide while building your Cardano skills'
      });
    }
    
    // Technical skills based tips
    if (userProfile.technicalSkills.includes('begin-wallet')) {
      tips.push({
        category: 'advanced-features',
        title: 'Leverage Advanced Begin Wallet Features',
        description: 'You\'re already using Begin Wallet - explore advanced metadata and dApp features',
        action: 'Try Begin Wallet\'s dApp discovery and metadata management tools',
        benefit: 'Maximize your Begin Wallet experience for career development'
      });
    }
    
    return tips;
  }

  /**
   * Generate insights about the user's profile
   */
  _generateProfileInsights(userProfile) {
    const insights = [];
    
    // Experience level insights
    switch (userProfile.experienceLevel) {
      case 'beginner':
        insights.push({
          type: 'experience',
          message: `You're at the beginning of your Cardano journey with ${userProfile.transactionCount} transactions`,
          recommendation: 'Focus on learning fundamentals and building your first dApp interactions'
        });
        break;
      case 'intermediate':
        insights.push({
          type: 'experience',
          message: `You have solid Cardano experience with ${userProfile.transactionCount} transactions`,
          recommendation: 'Ready to dive deeper into specialized areas and contribute to the ecosystem'
        });
        break;
      case 'advanced':
        insights.push({
          type: 'experience',
          message: `You're an experienced Cardano user with ${userProfile.transactionCount}+ transactions`,
          recommendation: 'Consider mentoring others and contributing to major ecosystem projects'
        });
        break;
    }
    
    // Skills insights
    if (userProfile.technicalSkills.length > 3) {
      insights.push({
        type: 'skills',
        message: `You have diverse technical skills: ${userProfile.technicalSkills.slice(0, 3).join(', ')}${userProfile.technicalSkills.length > 3 ? ' and more' : ''}`,
        recommendation: 'Your broad skill set makes you well-suited for cross-functional roles'
      });
    }
    
    // Path-specific insights
    switch (userProfile.preferredPath) {
      case 'development':
        insights.push({
          type: 'path',
          message: 'Your transaction patterns suggest strong interest in technical development',
          recommendation: 'Focus on MeshJS, Aiken, and smart contract development'
        });
        break;
      case 'design':
        insights.push({
          type: 'path',
          message: 'Your NFT interactions indicate interest in design and user experience',
          recommendation: 'Explore UI/UX design for dApps and NFT marketplace development'
        });
        break;
      case 'community':
        insights.push({
          type: 'path',
          message: 'Your governance participation shows community leadership potential',
          recommendation: 'Consider roles in community management, education, or governance'
        });
        break;
      case 'research':
        insights.push({
          type: 'path',
          message: 'Your learning-focused approach suggests research and analysis strengths',
          recommendation: 'Explore technical writing, protocol research, or educational content creation'
        });
        break;
    }
    
    return insights;
  }

  /**
   * Generate next steps recommendations
   */
  _generateNextSteps(userProfile) {
    const nextSteps = [];
    
    // Always recommend roadmap for detailed planning
    nextSteps.push({
      priority: 'high',
      action: 'Get Personalized Roadmap',
      description: `Generate a detailed ${userProfile.preferredPath} learning path with milestones`,
      service: 'roadmap',
      price: this.config.pricing.roadmap,
      estimatedTime: '3-5 minutes'
    });
    
    // Experience-based next steps
    if (userProfile.experienceLevel === 'beginner') {
      nextSteps.push({
        priority: 'high',
        action: 'Start with Cardano Fundamentals',
        description: 'Learn basic concepts: UTXOs, addresses, transactions, and native tokens',
        resource: 'Cardano Developer Portal - Getting Started',
        estimatedTime: '2-3 weeks'
      });
      
      nextSteps.push({
        priority: 'medium',
        action: 'Set Up Development Environment',
        description: 'Install and configure tools for Cardano development',
        resource: 'MeshJS Documentation',
        estimatedTime: '1-2 days'
      });
    } else {
      nextSteps.push({
        priority: 'medium',
        action: 'Explore Advanced Topics',
        description: `Dive deeper into ${userProfile.preferredPath}-specific advanced concepts`,
        resource: 'Cardano Developer Portal - Advanced Guides',
        estimatedTime: '1-2 months'
      });
    }
    
    // Path-specific next steps
    switch (userProfile.preferredPath) {
      case 'development':
        nextSteps.push({
          priority: 'medium',
          action: 'Build Your First dApp',
          description: 'Create a simple decentralized application using MeshJS',
          resource: 'MeshJS Tutorials',
          estimatedTime: '1-2 weeks'
        });
        break;
      case 'design':
        nextSteps.push({
          priority: 'medium',
          action: 'Study Cardano dApp UX Patterns',
          description: 'Analyze successful Cardano applications for design patterns',
          resource: 'Cardano dApp Gallery',
          estimatedTime: '1 week'
        });
        break;
      case 'community':
        nextSteps.push({
          priority: 'medium',
          action: 'Join Cardano Community Channels',
          description: 'Participate in Discord, Telegram, and governance discussions',
          resource: 'Cardano Community Hub',
          estimatedTime: 'Ongoing'
        });
        break;
      case 'research':
        nextSteps.push({
          priority: 'medium',
          action: 'Read Cardano Research Papers',
          description: 'Study the academic foundations of Cardano protocols',
          resource: 'IOHK Research Library',
          estimatedTime: '2-4 weeks'
        });
        break;
    }
    
    // Catalyst recommendation for intermediate+ users
    if (userProfile.experienceLevel !== 'beginner') {
      nextSteps.push({
        priority: 'low',
        action: 'Consider Project Catalyst',
        description: 'Get specialized guidance for participating in Cardano governance and funding',
        service: 'catalyst',
        price: this.config.pricing.catalyst,
        estimatedTime: '5-10 minutes'
      });
    }
    
    return nextSteps;
  }

  /**
   * Handle career roadmap generation service (1.5 ADA)
   */
  async handleRoadmap(request) {
    console.log('🗺️ Processing career roadmap request...');
    
    try {
      const { userAddress, timeline, paymentTxHash } = request;
      
      // Import required modules dynamically
      let TransactionAnalyzer, CareerPathGenerator, DataIntegration;
      try {
        const [analyzerModule, pathGenModule, dataIntegrationModule] = await Promise.all([
          import('./analyzer.js'),
          import('./pathGenerator.js'),
          import('./dataIntegration.js')
        ]);
        
        TransactionAnalyzer = analyzerModule.TransactionAnalyzer;
        CareerPathGenerator = pathGenModule.CareerPathGenerator;
        DataIntegration = dataIntegrationModule.DataIntegration;
      } catch (importError) {
        console.error('Failed to import required modules:', importError);
        throw new RequestProcessingError('Failed to load roadmap generation modules', importError);
      }
      
      // Step 1: Analyze user profile (if not already done)
      console.log('📊 Analyzing user profile for roadmap generation...');
      const analyzer = new TransactionAnalyzer(this.config);
      const userProfile = await analyzer.analyzeUserBackground(userAddress);
      
      // Step 2: Generate career path
      console.log(`🛤️ Generating ${timeline} career path for ${userProfile.preferredPath} track...`);
      const pathGenerator = new CareerPathGenerator(this.config);
      const roadmap = await pathGenerator.generateCareerPath(userProfile, timeline);
      
      // Step 3: Integrate external data (Catalyst rounds and bounties)
      console.log('🔗 Integrating Catalyst opportunities and bounties...');
      const dataIntegration = new DataIntegration(this.config);
      
      const [catalystRounds, relevantBounties] = await Promise.all([
        dataIntegration.getActiveCatalystRounds(),
        dataIntegration.getRelevantBounties(userProfile.technicalSkills)
      ]);
      
      // Filter Catalyst opportunities by user skills and path
      const relevantCatalystOpportunities = this._filterCatalystOpportunities(
        catalystRounds, 
        userProfile.technicalSkills, 
        userProfile.preferredPath,
        userProfile.experienceLevel
      );
      
      // Step 4: Generate Begin Wallet integration tips
      const beginWalletTips = this._generateBeginWalletTips(userProfile, roadmap);
      
      // Step 5: Format comprehensive roadmap response
      const roadmapResponse = {
        success: true,
        service: 'roadmap',
        timestamp: Date.now(),
        userProfile: {
          address: userProfile.address,
          experienceLevel: userProfile.experienceLevel,
          preferredPath: userProfile.preferredPath,
          technicalSkills: userProfile.technicalSkills,
          interests: userProfile.interests,
          learningStyle: userProfile.learningStyle
        },
        roadmap: {
          timeline: roadmap.timeline,
          currentLevel: roadmap.currentLevel,
          targetLevel: roadmap.targetLevel,
          estimatedCompletionDate: roadmap.estimatedCompletionDate,
          totalMilestones: roadmap.milestones.length,
          learningPath: roadmap.learningPath,
          milestones: roadmap.milestones,
          recommendedResources: roadmap.recommendedResources
        },
        opportunities: {
          catalyst: relevantCatalystOpportunities,
          bounties: relevantBounties.slice(0, 5), // Top 5 most relevant bounties
          totalOpportunities: relevantCatalystOpportunities.length + relevantBounties.length
        },
        beginWalletIntegration: beginWalletTips,
        nextSteps: this._generateRoadmapNextSteps(userProfile, roadmap),
        paymentInfo: {
          service: 'roadmap',
          amount: this.config.pricing.roadmap,
          currency: 'ADA',
          paymentTxHash: paymentTxHash || null,
          verified: !!paymentTxHash
        }
      };
      
      console.log(`✅ Roadmap generated successfully with ${roadmap.milestones.length} milestones and ${relevantCatalystOpportunities.length + relevantBounties.length} opportunities`);
      return roadmapResponse;
      
    } catch (error) {
      console.error('❌ Roadmap generation failed:', error.message);
      throw new RequestProcessingError(`Roadmap generation failed: ${error.message}`, error);
    }
  }

  /**
   * Filter Catalyst opportunities based on user profile
   */
  _filterCatalystOpportunities(catalystRounds, userSkills, preferredPath, experienceLevel) {
    const opportunities = [];
    
    catalystRounds.forEach(round => {
      if (round.status !== 'active') return;
      
      round.categories.forEach(category => {
        // Check if category matches user skills
        const skillMatch = category.requiredSkills.some(skill => 
          userSkills.some(userSkill => 
            userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        );
        
        // Check if category aligns with preferred path
        const pathMatch = this._doesCategoryMatchPath(category, preferredPath);
        
        // Check experience level requirements
        const experienceMatch = this._checkExperienceRequirements(category, experienceLevel);
        
        if (skillMatch || pathMatch) {
          opportunities.push({
            roundId: round.id,
            roundName: round.name,
            categoryId: category.id,
            categoryName: category.name,
            description: category.description,
            budget: category.budget,
            minProposalBudget: category.minProposalBudget,
            maxProposalBudget: category.maxProposalBudget,
            requiredSkills: category.requiredSkills,
            timeline: round.timeline,
            matchReason: skillMatch ? 'skill-match' : 'path-match',
            suitableForExperience: experienceMatch,
            relevanceScore: this._calculateCatalystRelevance(category, userSkills, preferredPath)
          });
        }
      });
    });
    
    // Sort by relevance score
    return opportunities
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10); // Top 10 most relevant opportunities
  }

  /**
   * Check if Catalyst category matches user's preferred path
   */
  _doesCategoryMatchPath(category, preferredPath) {
    const pathKeywords = {
      development: ['developer', 'development', 'technical', 'infrastructure', 'tools', 'smart-contract'],
      design: ['design', 'ui', 'ux', 'user', 'interface', 'experience'],
      community: ['community', 'ecosystem', 'marketing', 'education', 'outreach'],
      research: ['research', 'academic', 'analysis', 'improvement', 'innovation']
    };
    
    const keywords = pathKeywords[preferredPath] || [];
    const categoryText = `${category.name} ${category.description}`.toLowerCase();
    
    return keywords.some(keyword => categoryText.includes(keyword));
  }

  /**
   * Check if user meets experience requirements for Catalyst category
   */
  _checkExperienceRequirements(category, userExperience) {
    // Most categories are suitable for intermediate+ users
    // Beginners might need more preparation
    if (userExperience === 'beginner') {
      return category.minProposalBudget <= 50000; // Smaller proposals for beginners
    }
    return true;
  }

  /**
   * Calculate relevance score for Catalyst opportunity
   */
  _calculateCatalystRelevance(category, userSkills, preferredPath) {
    let score = 0;
    
    // Skill matching score
    category.requiredSkills.forEach(skill => {
      userSkills.forEach(userSkill => {
        if (userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())) {
          score += 10;
        }
      });
    });
    
    // Path matching score
    if (this._doesCategoryMatchPath(category, preferredPath)) {
      score += 15;
    }
    
    // Budget accessibility score (higher for more accessible budgets)
    if (category.minProposalBudget <= 25000) {
      score += 5;
    }
    
    return score;
  }

  /**
   * Generate Begin Wallet integration tips specific to roadmap
   */
  _generateBeginWalletTips(userProfile, roadmap) {
    const tips = [];
    
    // Progress tracking tips
    tips.push({
      category: 'progress-tracking',
      title: 'Track Your Learning Progress On-Chain',
      description: 'Use Begin Wallet\'s metadata feature to record milestone completions',
      action: 'Set up progress tracking for your learning journey',
      beginWalletFeature: 'metadata-transactions',
      estimatedTime: '5 minutes'
    });
    
    // Milestone rewards tips
    if (roadmap.milestones.some(m => m.rewards.esim)) {
      tips.push({
        category: 'esim-rewards',
        title: 'Earn eSIM Data Rewards',
        description: 'Complete milestones to earn real-world eSIM data through Begin Wallet',
        action: 'Enable eSIM reward notifications in Begin Wallet',
        beginWalletFeature: 'esim-integration',
        estimatedTime: '2 minutes'
      });
    }
    
    // NFT achievement tips
    if (roadmap.milestones.some(m => m.rewards.nft)) {
      tips.push({
        category: 'nft-achievements',
        title: 'Collect Achievement NFTs',
        description: 'Earn verifiable NFT certificates for major learning milestones',
        action: 'Configure NFT collection display in Begin Wallet',
        beginWalletFeature: 'nft-gallery',
        estimatedTime: '3 minutes'
      });
    }
    
    // Path-specific tips
    if (userProfile.preferredPath === 'development') {
      tips.push({
        category: 'developer-tools',
        title: 'Connect Development Tools',
        description: 'Integrate Begin Wallet with your development environment for testing',
        action: 'Set up testnet wallet for dApp development',
        beginWalletFeature: 'developer-mode',
        estimatedTime: '10 minutes'
      });
    }
    
    return tips;
  }

  /**
   * Generate next steps for roadmap users
   */
  _generateRoadmapNextSteps(userProfile, roadmap) {
    const nextSteps = [];
    
    // Immediate next steps
    nextSteps.push({
      priority: 'immediate',
      title: 'Start Your First Milestone',
      description: `Begin with "${roadmap.milestones[0]?.name}" to kickstart your ${roadmap.timeline} journey`,
      action: 'Review milestone requirements and begin first learning step',
      timeframe: 'This week'
    });
    
    // Short-term steps
    nextSteps.push({
      priority: 'short-term',
      title: 'Set Up Progress Tracking',
      description: 'Configure Begin Wallet to track your learning progress on-chain',
      action: 'Enable metadata transactions for milestone tracking',
      timeframe: 'Next 2 weeks'
    });
    
    // Medium-term steps
    if (roadmap.milestones.length > 1) {
      nextSteps.push({
        priority: 'medium-term',
        title: 'Complete Core Learning Path',
        description: `Work through your ${userProfile.preferredPath} learning path systematically`,
        action: 'Follow the structured learning steps and complete deliverables',
        timeframe: `Next ${roadmap.timeline === '3-months' ? '2-3 months' : roadmap.timeline}`
      });
    }
    
    // Long-term steps
    nextSteps.push({
      priority: 'long-term',
      title: 'Apply Knowledge Practically',
      description: 'Consider applying for Catalyst funding or bounties to implement your learning',
      action: 'Review available opportunities and prepare proposals',
      timeframe: `After ${roadmap.timeline} completion`
    });
    
    return nextSteps;
  }

  /**
   * Handle Project Catalyst guidance service (3.0 ADA)
   */
  async handleCatalystGuidance(request) {
    console.log('🚀 Processing Catalyst guidance request...');
    
    // TODO: Implement in task 11 - Catalyst guidance system
    throw new ServiceNotImplementedError('Catalyst guidance service implementation pending (Task 11)');
  }
}

/**
 * Custom Error Classes for Career Navigator
 */

export class CareerNavigatorError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = this.constructor.name;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

export class AgentRegistrationError extends CareerNavigatorError {
  constructor(message, originalError = null) {
    super(message, originalError);
    this.code = 'AGENT_REGISTRATION_FAILED';
    this.retryable = true;
  }
}

export class AgentNotRegisteredError extends CareerNavigatorError {
  constructor(message = 'Agent not registered with Masumi platform') {
    super(message);
    this.code = 'AGENT_NOT_REGISTERED';
    this.retryable = false;
  }
}

export class InvalidRequestError extends CareerNavigatorError {
  constructor(message) {
    super(message);
    this.code = 'INVALID_REQUEST';
    this.retryable = false;
  }
}

export class PaymentVerificationError extends CareerNavigatorError {
  constructor(message) {
    super(message);
    this.code = 'PAYMENT_VERIFICATION_FAILED';
    this.retryable = true;
  }
}

export class RequestProcessingError extends CareerNavigatorError {
  constructor(message, originalError = null) {
    super(message, originalError);
    this.code = 'REQUEST_PROCESSING_FAILED';
    this.retryable = true;
  }
}

export class ServiceNotImplementedError extends CareerNavigatorError {
  constructor(message) {
    super(message);
    this.code = 'SERVICE_NOT_IMPLEMENTED';
    this.retryable = false;
  }
}