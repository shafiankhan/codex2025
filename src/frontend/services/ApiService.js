/**
 * API Service - Handle communication with the Career Navigator backend
 */

export class ApiService {
    constructor() {
        this.baseUrl = '/api'; // Proxied through Vite to backend
        this.timeout = 30000; // 30 seconds
    }

    async requestAssessment(walletAddress, paymentTxHash = null) {
        const request = {
            type: 'assessment',
            userAddress: walletAddress,
            paymentTxHash: paymentTxHash || `mock_payment_${Date.now()}`
        };

        return await this.makeRequest('/process', request);
    }

    async requestRoadmap(walletAddress, timeline, paymentTxHash = null) {
        const request = {
            type: 'roadmap',
            userAddress: walletAddress,
            timeline: timeline,
            paymentTxHash: paymentTxHash || `mock_payment_${Date.now()}`
        };

        return await this.makeRequest('/process', request);
    }

    async requestCatalyst(walletAddress, paymentTxHash = null) {
        const request = {
            type: 'catalyst',
            userAddress: walletAddress,
            paymentTxHash: paymentTxHash || `mock_payment_${Date.now()}`
        };

        return await this.makeRequest('/process', request);
    }

    async getServiceInfo(serviceType = null) {
        const endpoint = serviceType ? `/services/${serviceType}` : '/services';
        return await this.makeRequest(endpoint, null, 'GET');
    }

    async getAgentStatus() {
        return await this.makeRequest('/status', null, 'GET');
    }

    async makeRequest(endpoint, data = null, method = 'POST') {
        const url = `${this.baseUrl}${endpoint}`;
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(this.timeout)
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        try {
            console.log(`Making ${method} request to ${url}`, data);
            
            const response = await fetch(url, options);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('API Response:', result);
            
            return result;

        } catch (error) {
            console.error('API Request failed:', error);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please try again.');
            }
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                // Network error - try mock response for demo
                console.log('Network error, using mock response for demo');
                return this.getMockResponse(endpoint, data);
            }
            
            throw error;
        }
    }

    // Mock responses for demo when backend is not available
    getMockResponse(endpoint, data) {
        if (endpoint === '/process') {
            switch (data?.type) {
                case 'assessment':
                    return this.getMockAssessmentResponse(data.userAddress);
                case 'roadmap':
                    return this.getMockRoadmapResponse(data.userAddress, data.timeline);
                case 'catalyst':
                    return this.getMockCatalystResponse(data.userAddress);
            }
        } else if (endpoint === '/services') {
            return this.getMockServicesResponse();
        } else if (endpoint === '/status') {
            return this.getMockStatusResponse();
        }

        throw new Error('Service temporarily unavailable');
    }

    getMockAssessmentResponse(address) {
        // Generate varied responses based on address
        const profiles = this.generateVariedProfiles(address);
        const profile = profiles[Math.floor(Math.random() * profiles.length)];
        
        return {
            success: true,
            service: 'assessment',
            userAddress: address,
            timestamp: Date.now(),
            profile: profile,
            insights: this.generateInsights(profile),
            nextSteps: this.generateNextSteps(profile),
            beginWalletIntegration: this.generateBeginWalletTips(profile),
            aiAnalysis: {
                confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
                dataPoints: profile.transactionCount,
                analysisTime: Math.floor(Math.random() * 3000) + 2000, // 2-5 seconds
                networkActivity: this.generateNetworkActivity(profile)
            }
        };
    }

    generateVariedProfiles(address) {
        return [
            {
                experienceLevel: 'beginner',
                technicalSkills: ['wallet-management', 'basic-transactions'],
                interests: ['learning', 'defi', 'nft'],
                learningStyle: 'visual',
                preferredPath: 'community',
                transactionCount: Math.floor(Math.random() * 10) + 5,
                analysisTimestamp: Date.now(),
                walletAge: Math.floor(Math.random() * 30) + 7, // 7-37 days
                favoriteProtocols: ['SundaeSwap', 'MinSwap']
            },
            {
                experienceLevel: 'intermediate',
                technicalSkills: ['dapp-interaction', 'defi', 'nft', 'governance'],
                interests: ['development', 'defi', 'catalyst'],
                learningStyle: 'hands-on',
                preferredPath: 'development',
                transactionCount: Math.floor(Math.random() * 50) + 25,
                analysisTimestamp: Date.now(),
                walletAge: Math.floor(Math.random() * 180) + 60, // 60-240 days
                favoriteProtocols: ['Aiken', 'MeshJS', 'Plutus', 'SundaeSwap']
            },
            {
                experienceLevel: 'advanced',
                technicalSkills: ['smart-contracts', 'plutus', 'aiken', 'meshjs', 'governance', 'catalyst'],
                interests: ['development', 'research', 'catalyst', 'education'],
                learningStyle: 'research-driven',
                preferredPath: 'research',
                transactionCount: Math.floor(Math.random() * 200) + 100,
                analysisTimestamp: Date.now(),
                walletAge: Math.floor(Math.random() * 365) + 180, // 180-545 days
                favoriteProtocols: ['Plutus', 'Aiken', 'Hydra', 'Mithril', 'Catalyst']
            },
            {
                experienceLevel: 'intermediate',
                technicalSkills: ['nft', 'design', 'ui-ux', 'dapp-interaction'],
                interests: ['design', 'nft', 'art', 'community'],
                learningStyle: 'creative',
                preferredPath: 'design',
                transactionCount: Math.floor(Math.random() * 80) + 30,
                analysisTimestamp: Date.now(),
                walletAge: Math.floor(Math.random() * 120) + 45, // 45-165 days
                favoriteProtocols: ['CNFT.io', 'JPG.store', 'SpaceBudz']
            }
        ];
    }

    generateInsights(profile) {
        const insights = [];
        
        // Experience insights
        if (profile.experienceLevel === 'beginner') {
            insights.push({
                type: 'experience',
                message: `You're new to Cardano with ${profile.transactionCount} transactions over ${profile.walletAge} days`,
                recommendation: 'Focus on learning fundamentals and exploring different dApps safely'
            });
        } else if (profile.experienceLevel === 'intermediate') {
            insights.push({
                type: 'experience',
                message: `You have solid Cardano experience with ${profile.transactionCount} transactions`,
                recommendation: 'Ready to dive deeper into specialized areas and contribute to the ecosystem'
            });
        } else {
            insights.push({
                type: 'experience',
                message: `You're an experienced Cardano user with ${profile.transactionCount}+ transactions`,
                recommendation: 'Consider mentoring others and contributing to major ecosystem projects'
            });
        }

        // Skills insights
        if (profile.technicalSkills.length > 3) {
            insights.push({
                type: 'skills',
                message: `You have diverse technical skills: ${profile.technicalSkills.slice(0, 3).join(', ')}`,
                recommendation: 'Your broad skill set makes you well-suited for cross-functional roles'
            });
        }

        // Path-specific insights
        const pathInsights = {
            development: 'Your transaction patterns suggest strong interest in technical development',
            design: 'Your NFT interactions indicate interest in design and user experience',
            community: 'Your governance participation shows community leadership potential',
            research: 'Your learning-focused approach suggests research and analysis strengths'
        };

        if (pathInsights[profile.preferredPath]) {
            insights.push({
                type: 'path',
                message: pathInsights[profile.preferredPath],
                recommendation: this.getPathRecommendation(profile.preferredPath)
            });
        }

        return insights;
    }

    getPathRecommendation(path) {
        const recommendations = {
            development: 'Focus on MeshJS, Aiken, and smart contract development',
            design: 'Explore UI/UX design for dApps and NFT marketplace development',
            community: 'Consider roles in community management, education, or governance',
            research: 'Explore technical writing, protocol research, or educational content creation'
        };
        return recommendations[path] || 'Continue exploring your interests in the Cardano ecosystem';
    }

    generateNextSteps(profile) {
        const steps = [
            {
                priority: 'high',
                action: 'Get Personalized Roadmap',
                description: `Generate a detailed ${profile.preferredPath} learning path with milestones`,
                service: 'roadmap',
                price: 0.3, // Testnet pricing
                estimatedTime: '3-5 minutes'
            }
        ];

        // Add experience-specific steps
        if (profile.experienceLevel === 'beginner') {
            steps.push({
                priority: 'high',
                action: 'Start with Cardano Fundamentals',
                description: 'Learn basic concepts: UTXOs, addresses, transactions, and native tokens',
                resource: 'Cardano Developer Portal - Getting Started',
                estimatedTime: '2-3 weeks'
            });
        } else {
            steps.push({
                priority: 'medium',
                action: 'Explore Advanced Topics',
                description: `Dive deeper into ${profile.preferredPath}-specific advanced concepts`,
                resource: 'Cardano Developer Portal - Advanced Guides',
                estimatedTime: '1-2 months'
            });
        }

        // Add Catalyst for intermediate+ users
        if (profile.experienceLevel !== 'beginner') {
            steps.push({
                priority: 'low',
                action: 'Consider Project Catalyst',
                description: 'Get specialized guidance for participating in Cardano governance and funding',
                service: 'catalyst',
                price: 0.5, // Testnet pricing
                estimatedTime: '5-10 minutes'
            });
        }

        return steps;
    }

    generateBeginWalletTips(profile) {
        const tips = [
            {
                category: 'progress-tracking',
                title: 'Track Your Learning Progress On-Chain',
                description: 'Use Begin Wallet to store your learning milestones as on-chain metadata',
                action: 'Enable metadata tracking in Begin Wallet settings',
                benefit: 'Verifiable proof of your Cardano learning journey'
            }
        ];

        if (profile.experienceLevel === 'beginner') {
            tips.push({
                category: 'getting-started',
                title: 'Start with Begin Wallet Basics',
                description: 'Begin Wallet offers unique features like eSIM integration and metadata storage',
                action: 'Explore Begin Wallet\'s educational resources and tutorials',
                benefit: 'Learn Cardano fundamentals while using real-world utility features'
            });
        }

        if (profile.interests.includes('travel') || profile.favoriteProtocols.includes('Begin')) {
            tips.push({
                category: 'esim-rewards',
                title: 'Earn eSIM Data Rewards',
                description: 'Complete learning milestones to earn mobile data through Begin Wallet',
                action: 'Set up eSIM functionality in Begin Wallet',
                benefit: 'Get real-world value from your learning achievements'
            });
        }

        return tips;
    }

    generateNetworkActivity(profile) {
        return {
            mostActiveHours: [14, 15, 16, 20, 21], // 2-4 PM, 8-9 PM
            favoriteProtocols: profile.favoriteProtocols,
            transactionTypes: this.getTransactionTypes(profile),
            networkUsage: {
                mainnet: profile.experienceLevel !== 'beginner' ? Math.floor(Math.random() * 80) + 20 : 0,
                testnet: Math.floor(Math.random() * 50) + 10
            }
        };
    }

    getTransactionTypes(profile) {
        const types = ['simple-send'];
        
        if (profile.technicalSkills.includes('defi')) {
            types.push('dex-swap', 'liquidity-provision');
        }
        if (profile.technicalSkills.includes('nft')) {
            types.push('nft-mint', 'nft-trade');
        }
        if (profile.technicalSkills.includes('governance')) {
            types.push('voting', 'delegation');
        }
        if (profile.technicalSkills.includes('smart-contracts')) {
            types.push('contract-interaction', 'script-execution');
        }
        
        return types;
    }

    getMockRoadmapResponse(address, timeline) {
        // Generate varied roadmap based on user profile
        const profiles = this.generateVariedProfiles(address);
        const profile = profiles[Math.floor(Math.random() * profiles.length)];
        
        const roadmapData = this.generateRoadmapByPath(profile, timeline);
        
        return {
            success: true,
            service: 'roadmap',
            timestamp: Date.now(),
            userProfile: {
                address: address,
                experienceLevel: profile.experienceLevel,
                preferredPath: profile.preferredPath,
                technicalSkills: profile.technicalSkills,
                interests: profile.interests,
                learningStyle: profile.learningStyle
            },
            roadmap: roadmapData,
            opportunities: this.generateOpportunities(profile),
            beginWalletIntegration: this.generateRoadmapBeginWalletTips(profile, roadmapData),
            nextSteps: this.generateRoadmapNextSteps(profile, roadmapData),
            aiInsights: {
                personalizedFor: profile.preferredPath,
                difficultyAdjustment: profile.experienceLevel,
                estimatedSuccessRate: Math.floor(Math.random() * 20) + 75, // 75-95%
                similarUserOutcomes: this.generateSimilarUserStats(profile)
            }
        };
    }

    generateRoadmapByPath(profile, timeline) {
        const timelineMonths = timeline === '3-months' ? 3 : timeline === '6-months' ? 6 : 12;
        const milestoneCount = Math.floor(timelineMonths * 1.5) + (profile.experienceLevel === 'beginner' ? 1 : 0);
        
        const roadmapTemplates = {
            development: {
                learningPath: ['Smart Contract Basics', 'MeshJS Framework', 'Plutus Development', 'dApp Architecture', 'Testing & Deployment'],
                milestones: [
                    { name: 'Master MeshJS Framework', description: 'Build your first dApp with MeshJS', skills: ['meshjs', 'javascript'] },
                    { name: 'Plutus Smart Contracts', description: 'Write and deploy smart contracts', skills: ['plutus', 'haskell'] },
                    { name: 'DeFi Protocol Integration', description: 'Integrate with major DeFi protocols', skills: ['defi', 'api-integration'] },
                    { name: 'Full-Stack dApp', description: 'Build a complete decentralized application', skills: ['frontend', 'backend', 'blockchain'] },
                    { name: 'Open Source Contribution', description: 'Contribute to Cardano ecosystem projects', skills: ['git', 'collaboration'] }
                ]
            },
            design: {
                learningPath: ['UI/UX Fundamentals', 'Cardano Design Patterns', 'NFT Design', 'dApp User Experience', 'Design Systems'],
                milestones: [
                    { name: 'Cardano Design Principles', description: 'Learn Cardano-specific design patterns', skills: ['ui-design', 'cardano-ux'] },
                    { name: 'NFT Collection Design', description: 'Create a complete NFT collection', skills: ['nft-design', 'digital-art'] },
                    { name: 'dApp Interface Design', description: 'Design user interfaces for dApps', skills: ['figma', 'prototyping'] },
                    { name: 'Wallet UX Optimization', description: 'Design wallet integration flows', skills: ['ux-research', 'user-testing'] },
                    { name: 'Design System Creation', description: 'Build reusable design components', skills: ['design-systems', 'documentation'] }
                ]
            },
            community: {
                learningPath: ['Community Building', 'Content Creation', 'Event Management', 'Governance Participation', 'Education & Outreach'],
                milestones: [
                    { name: 'Community Engagement', description: 'Build presence in Cardano communities', skills: ['communication', 'networking'] },
                    { name: 'Content Creation', description: 'Create educational content about Cardano', skills: ['writing', 'video-editing'] },
                    { name: 'Event Organization', description: 'Organize local Cardano meetups', skills: ['event-planning', 'public-speaking'] },
                    { name: 'Governance Participation', description: 'Actively participate in Cardano governance', skills: ['governance', 'voting'] },
                    { name: 'Educational Program', description: 'Launch a Cardano education initiative', skills: ['curriculum-design', 'teaching'] }
                ]
            },
            research: {
                learningPath: ['Academic Research', 'Protocol Analysis', 'Technical Writing', 'Peer Review', 'Innovation & Development'],
                milestones: [
                    { name: 'Protocol Deep Dive', description: 'Comprehensive study of Cardano protocols', skills: ['research', 'analysis'] },
                    { name: 'Technical Paper', description: 'Write and publish technical analysis', skills: ['technical-writing', 'peer-review'] },
                    { name: 'Innovation Proposal', description: 'Propose improvements to Cardano', skills: ['innovation', 'proposal-writing'] },
                    { name: 'Research Collaboration', description: 'Collaborate with academic institutions', skills: ['collaboration', 'academia'] },
                    { name: 'Conference Presentation', description: 'Present research at blockchain conferences', skills: ['public-speaking', 'presentation'] }
                ]
            }
        };

        const template = roadmapTemplates[profile.preferredPath] || roadmapTemplates.development;
        const selectedMilestones = template.milestones.slice(0, milestoneCount);

        return {
            timeline: timeline,
            currentLevel: profile.experienceLevel,
            targetLevel: profile.experienceLevel === 'beginner' ? 'intermediate' : 'advanced',
            estimatedCompletionDate: new Date(Date.now() + timelineMonths * 30 * 24 * 60 * 60 * 1000).toISOString(),
            totalMilestones: selectedMilestones.length,
            learningPath: template.learningPath.slice(0, Math.min(template.learningPath.length, timelineMonths + 2)),
            milestones: selectedMilestones.map((milestone, index) => ({
                id: index + 1,
                name: milestone.name,
                description: milestone.description,
                targetWeek: Math.floor((index + 1) * (timelineMonths * 4) / selectedMilestones.length),
                estimatedDate: new Date(Date.now() + (index + 1) * (timelineMonths * 30 * 24 * 60 * 60 * 1000) / selectedMilestones.length).toISOString(),
                verification: this.generateVerificationMethod(milestone.skills),
                rewards: {
                    nft: Math.random() > 0.5,
                    esim: Math.random() > 0.7,
                    ada: Math.floor(Math.random() * 5) + 1
                },
                requiredSkills: milestone.skills,
                difficulty: profile.experienceLevel === 'beginner' ? 'beginner' : Math.random() > 0.5 ? 'intermediate' : 'advanced'
            })),
            recommendedResources: this.generateResources(profile.preferredPath),
            estimatedWeeklyHours: profile.experienceLevel === 'beginner' ? 8 : profile.experienceLevel === 'intermediate' ? 6 : 4
        };
    }

    generateVerificationMethod(skills) {
        const methods = [
            'Complete hands-on project',
            'Pass community assessment',
            'Peer review and feedback',
            'Portfolio submission',
            'Live demonstration',
            'Written documentation',
            'Code review by mentor',
            'Community presentation'
        ];
        return methods[Math.floor(Math.random() * methods.length)];
    }

    generateResources(path) {
        const resourcesByPath = {
            development: [
                { title: 'MeshJS Documentation', url: 'https://meshjs.dev', type: 'documentation' },
                { title: 'Cardano Developer Portal', url: 'https://developers.cardano.org', type: 'tutorial' },
                { title: 'Plutus Pioneer Program', url: 'https://plutus-pioneer-program.readthedocs.io', type: 'course' },
                { title: 'Aiken Language Guide', url: 'https://aiken-lang.org', type: 'documentation' }
            ],
            design: [
                { title: 'Cardano Design Guidelines', url: 'https://www.figma.com/cardano-design', type: 'guidelines' },
                { title: 'NFT Design Best Practices', url: 'https://nft-design.guide', type: 'tutorial' },
                { title: 'dApp UX Patterns', url: 'https://dapp-ux.com', type: 'resource' }
            ],
            community: [
                { title: 'Cardano Community Hub', url: 'https://cardano.org/community', type: 'community' },
                { title: 'Ambassador Program', url: 'https://cardano.org/ambassadors', type: 'program' },
                { title: 'Event Planning Toolkit', url: 'https://events.cardano.org', type: 'toolkit' }
            ],
            research: [
                { title: 'IOHK Research Papers', url: 'https://iohk.io/research', type: 'academic' },
                { title: 'Cardano Improvement Proposals', url: 'https://cips.cardano.org', type: 'documentation' },
                { title: 'Academic Collaboration Network', url: 'https://cardano.org/research', type: 'network' }
            ]
        };
        
        return resourcesByPath[path] || resourcesByPath.development;
    }

    generateOpportunities(profile) {
        const catalystOpportunities = [
            {
                roundId: 'fund12',
                roundName: 'Fund 12',
                categoryName: 'Developer Tools',
                description: 'Tools and infrastructure for Cardano developers',
                budget: 2000000,
                minProposalBudget: 15000,
                maxProposalBudget: 200000,
                relevanceScore: profile.preferredPath === 'development' ? 95 : 60,
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                roundId: 'fund12',
                roundName: 'Fund 12',
                categoryName: 'Community & Outreach',
                description: 'Projects that grow and educate the Cardano community',
                budget: 1500000,
                minProposalBudget: 10000,
                maxProposalBudget: 150000,
                relevanceScore: profile.preferredPath === 'community' ? 95 : 40,
                deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        const bounties = [
            {
                id: 'bounty_001',
                title: 'MeshJS Tutorial Series',
                reward: 500,
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                requiredSkills: ['meshjs', 'tutorial-creation'],
                relevanceScore: profile.technicalSkills.includes('meshjs') ? 90 : 30,
                difficulty: 'intermediate'
            },
            {
                id: 'bounty_002',
                title: 'Cardano Design System',
                reward: 750,
                deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                requiredSkills: ['ui-design', 'design-systems'],
                relevanceScore: profile.preferredPath === 'design' ? 95 : 20,
                difficulty: 'advanced'
            },
            {
                id: 'bounty_003',
                title: 'Community Event Toolkit',
                reward: 300,
                deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
                requiredSkills: ['event-planning', 'documentation'],
                relevanceScore: profile.preferredPath === 'community' ? 85 : 25,
                difficulty: 'beginner'
            }
        ];

        // Filter and sort by relevance
        const relevantCatalyst = catalystOpportunities
            .filter(opp => opp.relevanceScore > 50)
            .sort((a, b) => b.relevanceScore - a.relevanceScore);
            
        const relevantBounties = bounties
            .filter(bounty => bounty.relevanceScore > 40)
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 3);

        return {
            catalyst: relevantCatalyst,
            bounties: relevantBounties,
            totalOpportunities: relevantCatalyst.length + relevantBounties.length
        };
    }

    generateRoadmapBeginWalletTips(profile, roadmap) {
        const tips = [
            {
                category: 'progress-tracking',
                title: 'Track Your Learning Progress On-Chain',
                description: 'Use Begin Wallet\'s metadata feature to record milestone completions',
                action: 'Set up progress tracking for your learning journey',
                beginWalletFeature: 'metadata-transactions',
                estimatedTime: '5 minutes'
            }
        ];

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

        return tips;
    }

    generateRoadmapNextSteps(profile, roadmap) {
        return [
            {
                priority: 'immediate',
                title: 'Start Your First Milestone',
                description: `Begin with "${roadmap.milestones[0]?.name}" to kickstart your ${roadmap.timeline} journey`,
                action: 'Review milestone requirements and begin first learning step',
                timeframe: 'This week'
            },
            {
                priority: 'short-term',
                title: 'Set Up Progress Tracking',
                description: 'Configure Begin Wallet to track your learning progress on-chain',
                action: 'Enable metadata transactions for milestone tracking',
                timeframe: 'Next 2 weeks'
            },
            {
                priority: 'medium-term',
                title: `Complete ${profile.preferredPath.charAt(0).toUpperCase() + profile.preferredPath.slice(1)} Path`,
                description: `Work through your ${profile.preferredPath} learning path systematically`,
                action: 'Follow the structured learning steps and complete deliverables',
                timeframe: `Next ${roadmap.timeline}`
            }
        ];
    }

    generateSimilarUserStats(profile) {
        return {
            totalUsers: Math.floor(Math.random() * 500) + 100,
            completionRate: Math.floor(Math.random() * 30) + 65, // 65-95%
            averageTimeToComplete: profile.experienceLevel === 'beginner' ? '4-6 months' : '2-4 months',
            topChallenges: this.getTopChallenges(profile.preferredPath),
            successFactors: this.getSuccessFactors(profile.preferredPath)
        };
    }

    getTopChallenges(path) {
        const challenges = {
            development: ['Smart contract complexity', 'Testing environments', 'Documentation gaps'],
            design: ['Technical constraints', 'User research access', 'Design system adoption'],
            community: ['Engagement consistency', 'Content creation time', 'Event coordination'],
            research: ['Academic access', 'Peer review process', 'Publication timelines']
        };
        return challenges[path] || challenges.development;
    }

    getSuccessFactors(path) {
        const factors = {
            development: ['Consistent coding practice', 'Community participation', 'Project-based learning'],
            design: ['User feedback integration', 'Portfolio development', 'Design community engagement'],
            community: ['Regular content creation', 'Event participation', 'Network building'],
            research: ['Academic collaboration', 'Regular publication', 'Conference participation']
        };
        return factors[path] || factors.development;
    }

    getMockCatalystResponse(address) {
        return {
            success: true,
            service: 'catalyst',
            userAddress: address,
            timestamp: Date.now(),
            guidance: {
                proposalStrategy: 'Focus on developer tools and education',
                budgetRecommendation: '50,000 - 100,000 ADA',
                timelineAdvice: '6-12 months for development projects',
                communityEngagement: 'Start building community early'
            },
            opportunities: [
                {
                    fund: 'Fund 12',
                    category: 'Developer Tools',
                    deadline: '2024-03-15',
                    recommendedBudget: '75,000 ADA'
                }
            ]
        };
    }

    getMockServicesResponse() {
        return {
            assessment: {
                name: 'Skills Assessment',
                description: 'Analyze on-chain activity to determine skills and experience level',
                price: 0.1, // Testnet pricing
                currency: 'tADA',
                estimatedTime: '2-3 minutes',
                features: ['On-chain activity analysis', 'Skill identification', 'Experience level assessment', 'Begin Wallet integration tips']
            },
            roadmap: {
                name: 'Career Roadmap',
                description: 'Generate personalized learning path with milestones and resources',
                price: 0.3, // Testnet pricing
                currency: 'tADA',
                estimatedTime: '3-5 minutes',
                features: ['Personalized milestones', 'Resource recommendations', 'Catalyst opportunities', 'Progress tracking setup']
            },
            catalyst: {
                name: 'Catalyst Guidance',
                description: 'Specialized guidance for Project Catalyst proposal creation',
                price: 0.5, // Testnet pricing
                currency: 'tADA',
                estimatedTime: '5-10 minutes',
                features: ['Proposal writing help', 'Budget planning', 'Community engagement', 'Voting strategies']
            }
        };
    }

    getMockStatusResponse() {
        return {
            isRegistered: true,
            agentId: 'cardano-career-navigator',
            network: 'preprod',
            services: ['assessment', 'roadmap', 'catalyst'],
            uptime: 3600,
            version: '1.0.0'
        };
    }
}