# Requirements Document

## Introduction

The Cardano Career Navigator is a Masumi AI agent that provides personalized career guidance for entering the Cardano ecosystem. Unlike generic Web3 career advice, this agent analyzes users' on-chain activity to create tailored learning paths, integrates with Begin Wallet's unique features, and monetizes through ADA payments. The system addresses the real pain point that 78% of new users struggle with knowing where to start in the Cardano ecosystem.

## Requirements

### Requirement 1: User Skills Assessment Service

**User Story:** As a newcomer to the Cardano ecosystem, I want to receive a personalized skills assessment based on my on-chain activity, so that I can understand my current level and get relevant career guidance.

#### Acceptance Criteria

1. WHEN a user pays 0.5 ADA for assessment THEN the system SHALL analyze their transaction history from their wallet address
2. WHEN analyzing transaction history THEN the system SHALL determine experience level (beginner, intermediate, advanced) based on transaction count and complexity
3. WHEN analyzing transactions THEN the system SHALL extract technical skills from NFT interactions, DeFi usage, governance participation, and Begin Wallet specific patterns
4. WHEN analyzing transactions THEN the system SHALL identify user interests from eSIM usage, staking patterns, and other on-chain behaviors
5. WHEN assessment is complete THEN the system SHALL return a profile containing experience level, technical skills, interests, learning style, and preferred career path
6. WHEN assessment is complete THEN the system SHALL provide next steps including options for roadmap generation and Catalyst guidance

### Requirement 2: Personalized Career Roadmap Generation

**User Story:** As a Cardano ecosystem participant, I want to receive a detailed career roadmap with milestones and resources, so that I can systematically progress toward my career goals.

#### Acceptance Criteria

1. WHEN a user pays 1.5 ADA for roadmap generation THEN the system SHALL create a personalized learning path based on their assessment profile
2. WHEN generating roadmap THEN the system SHALL include timeline-based milestones (3-month, 6-month, or 12-month options)
3. WHEN generating roadmap THEN the system SHALL provide recommended resources specific to Cardano ecosystem (MeshJS, Aiken, Cardano Developer Portal)
4. WHEN generating roadmap THEN the system SHALL include relevant Project Catalyst opportunities matching user skills and interests
5. WHEN generating roadmap THEN the system SHALL include bounty opportunities from the Cardano ecosystem
6. WHEN generating roadmap THEN the system SHALL provide Begin Wallet integration tips specific to user profile
7. WHEN roadmap is generated THEN the system SHALL include verification steps for each milestone

### Requirement 3: Project Catalyst Proposal Guidance

**User Story:** As an aspiring Catalyst proposer, I want specialized guidance for creating and submitting Project Catalyst proposals, so that I can successfully participate in Cardano governance and funding.

#### Acceptance Criteria

1. WHEN a user pays 3.0 ADA for Catalyst guidance THEN the system SHALL provide readiness assessment based on experience level
2. WHEN providing Catalyst guidance THEN the system SHALL include key proposal components (problem statement, budget, outcomes, engagement plan)
3. WHEN providing Catalyst guidance THEN the system SHALL suggest realistic timeline for proposal preparation based on user experience
4. WHEN providing Catalyst guidance THEN the system SHALL include active Catalyst rounds relevant to user skills
5. WHEN providing Catalyst guidance THEN the system SHALL provide submission tips including Begin Wallet integration for progress tracking
6. WHEN providing Catalyst guidance THEN the system SHALL include resources like Catalyst Academy and proposal templates

### Requirement 4: On-Chain Progress Tracking Integration

**User Story:** As a learner in the Cardano ecosystem, I want my progress to be recorded on-chain using Begin Wallet's metadata system, so that I have verifiable proof of my learning achievements.

#### Acceptance Criteria

1. WHEN a user completes a milestone THEN the system SHALL create a transaction storing progress as on-chain metadata
2. WHEN storing progress THEN the system SHALL use metadata label 100 (Begin Wallet's standard for ratings)
3. WHEN storing progress THEN the system SHALL include milestone name, timestamp, and progress percentage
4. WHEN progress is recorded THEN the system SHALL return transaction hash for verification
5. WHEN progress tracking fails THEN the system SHALL provide clear error message and fallback options
6. IF user has Begin Wallet THEN the system SHALL leverage Begin Wallet's metadata reading capabilities

### Requirement 5: Achievement NFT System

**User Story:** As a Cardano learner, I want to earn NFT certificates for completing major milestones, so that I can showcase my verified achievements in my wallet.

#### Acceptance Criteria

1. WHEN a user completes a major milestone THEN the system SHALL mint an achievement NFT to their wallet
2. WHEN minting achievement NFT THEN the system SHALL include metadata with achievement title, description, date earned, and verification status
3. WHEN minting NFT THEN the system SHALL use a consistent policy ID for all career achievement NFTs
4. WHEN NFT is minted THEN the system SHALL return transaction hash and NFT identifier
5. WHEN NFT minting fails THEN the system SHALL provide clear error message and retry options
6. IF user wallet supports NFT display THEN the achievements SHALL be visible in their wallet gallery

### Requirement 6: eSIM Reward Integration

**User Story:** As a Begin Wallet user completing learning milestones, I want to earn eSIM data rewards, so that I receive real-world utility for my educational progress.

#### Acceptance Criteria

1. WHEN a user completes specific milestones THEN the system SHALL offer eSIM data rewards based on milestone significance
2. WHEN eSIM reward is available THEN the system SHALL provide reward details including data amount and duration
3. WHEN user claims eSIM reward THEN the system SHALL provide clear instructions for claiming through Begin Wallet
4. WHEN generating claim instructions THEN the system SHALL include Begin Wallet deep link for seamless user experience
5. IF milestone has no eSIM reward THEN the system SHALL clearly communicate this to avoid user confusion
6. WHEN eSIM integration fails THEN the system SHALL provide alternative reward options

### Requirement 7: Masumi Agent Registration and Payment Processing

**User Story:** As a service provider, I want the Career Navigator to be properly registered as a Masumi agent with clear pricing, so that users can discover and pay for services seamlessly.

#### Acceptance Criteria

1. WHEN system initializes THEN the agent SHALL register with Masumi platform successfully
2. WHEN registering THEN the agent SHALL specify clear pricing for each service (0.5 ADA assessment, 1.5 ADA roadmap, 3.0 ADA Catalyst guidance)
3. WHEN user requests service THEN the system SHALL verify payment before providing service
4. WHEN payment is confirmed THEN the system SHALL process the request and deliver promised value
5. WHEN service fails after payment THEN the system SHALL provide clear error handling and potential refund process
6. IF agent registration fails THEN the system SHALL provide clear error messages for debugging

### Requirement 8: Real-Time Data Integration

**User Story:** As a user receiving career guidance, I want the recommendations to be based on current Cardano ecosystem opportunities, so that the advice remains relevant and actionable.

#### Acceptance Criteria

1. WHEN generating roadmap THEN the system SHALL fetch current Project Catalyst rounds from live API
2. WHEN providing bounty recommendations THEN the system SHALL include active bounties with current deadlines and rewards
3. WHEN system cannot access live data THEN the system SHALL use cached data and inform user of data freshness
4. WHEN API calls fail THEN the system SHALL gracefully degrade to static recommendations
5. IF data is older than 7 days THEN the system SHALL warn user about potential staleness
6. WHEN integrating external APIs THEN the system SHALL handle rate limiting and timeouts appropriately