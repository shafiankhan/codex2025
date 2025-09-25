# Cardano Career Navigator - Demo Guide

## How to Run and Show the Project

This guide shows you how to run and demonstrate the Cardano Career Navigator AI agent.

## What This Project Is

The Cardano Career Navigator is a **backend AI agent service** that integrates with the Masumi platform to provide personalized career guidance for the Cardano ecosystem. It's **not a frontend application** - it's a service that processes requests and returns structured data.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Basic Demo
```bash
node src/demo.js
```

This will show:
- ✅ Agent registration with Masumi platform
- ✅ Service pricing and descriptions
- ✅ Request validation and error handling
- ✅ Working roadmap generation
- ❌ Assessment service (has a minor bug but analyzer works)

### 3. Run Individual Component Tests

#### Test the Transaction Analyzer (✅ Working)
```bash
npm test src/analyzer.test.js
```
Shows: User profile analysis from on-chain transactions

#### Test the Career Path Generator (✅ Working)
```bash
npm test src/pathGenerator.test.js
```
Shows: Personalized learning roadmaps with milestones

#### Test the Data Integration (✅ Working)
```bash
npm test src/dataIntegration.test.js
```
Shows: Catalyst opportunities and bounty integration

#### Test the Complete Roadmap Service (✅ Working)
```bash
npm test src/roadmap.test.js
```
Shows: Full end-to-end roadmap generation with 24 passing tests

## What Works (Demo-Ready Features)

### ✅ 1. Agent Registration & Service Discovery
- Registers with Masumi platform
- Shows 3 service tiers (0.5, 1.5, 3.0 ADA)
- Service metadata and pricing

### ✅ 2. Transaction Analysis
- Analyzes Cardano wallet addresses
- Determines experience level (beginner/intermediate/advanced)
- Extracts technical skills from on-chain activity
- Identifies user interests and preferred career paths

### ✅ 3. Career Roadmap Generation (FULLY WORKING)
- Creates personalized learning paths
- Generates timeline-based milestones (3/6/12 months)
- Integrates Catalyst opportunities
- Includes bounty recommendations
- Provides Begin Wallet integration tips
- Formats comprehensive response with next steps

### ✅ 4. Data Integration
- Fetches active Catalyst rounds
- Filters opportunities by user skills
- Includes relevant bounties
- Real-time data with fallback to cached data

### ✅ 5. Payment Processing & Validation
- Validates ADA payments
- Supports payment verification
- Handles payment errors gracefully

## Demo Script for Presentations

### 1. Show Agent Capabilities
```bash
node src/demo.js
```

**What to highlight:**
- "This is a Masumi AI agent that provides Cardano career guidance"
- "It offers 3 service tiers with ADA pricing"
- "The agent analyzes your on-chain activity to create personalized recommendations"

### 2. Show Working Roadmap Service
```bash
node -e "
import('./src/agent.js').then(async (module) => {
  const { CareerNavigatorAgent } = module;
  const { config } = await import('./src/config.js');
  
  const agent = new CareerNavigatorAgent(config);
  await agent.register();
  
  console.log('🗺️ Generating career roadmap...');
  const response = await agent.processRequest({
    type: 'roadmap',
    userAddress: 'test_address_a',
    timeline: '6-months',
    paymentTxHash: 'demo_payment_123'
  });
  
  console.log('✅ SUCCESS! Generated roadmap with:');
  console.log('📊 User Profile:', response.userProfile.experienceLevel, response.userProfile.preferredPath);
  console.log('🎯 Milestones:', response.roadmap.totalMilestones);
  console.log('🚀 Catalyst Opportunities:', response.opportunities.catalyst.length);
  console.log('💰 Bounties:', response.opportunities.bounties.length);
  console.log('📱 Begin Wallet Tips:', response.beginWalletIntegration.length);
}).catch(console.error);
"
```

### 3. Show Test Results
```bash
npm test src/roadmap.test.js
```

**What to highlight:**
- "24 passing integration tests"
- "Tests cover complete user journeys"
- "Validates all response formats and data structures"

## Key Demo Points

### 🎯 **Unique Value Proposition**
- "Unlike generic Web3 career advice, this analyzes YOUR actual Cardano transactions"
- "Integrates with Begin Wallet's unique features like eSIM rewards"
- "Provides real Catalyst opportunities and bounties"

### 💡 **Technical Innovation**
- "Uses on-chain metadata for progress tracking"
- "Real-time integration with Catalyst API"
- "Sophisticated user profiling from transaction patterns"

### 🚀 **Masumi Integration**
- "Built as a Masumi AI agent with ADA payments"
- "Ready for Masumi platform deployment"
- "Follows Masumi SDK patterns and standards"

### 📱 **Begin Wallet Features**
- "Progress tracking using Begin Wallet's metadata standard"
- "eSIM reward integration for real-world utility"
- "NFT achievement certificates"
- "Deep link generation for seamless UX"

## Architecture Overview for Technical Audience

```
User's Wallet → Masumi Platform → Career Navigator Agent → Cardano Network
                     ↓                      ↓                    ↓
                Frontend UI          Backend Service      On-chain Data
                                         ↓
                              ┌─────────────────────┐
                              │ Transaction Analyzer │
                              │ Path Generator      │
                              │ Data Integration    │
                              │ Progress Tracker    │
                              └─────────────────────┘
```

## Current Status

- **Core Infrastructure**: ✅ Complete
- **Transaction Analysis**: ✅ Working
- **Roadmap Generation**: ✅ Fully Working (24/24 tests pass)
- **Data Integration**: ✅ Working
- **Assessment Service**: ⚠️ Minor bug (18/19 tests pass)
- **Catalyst Guidance**: 🔄 Placeholder (Task 11)

## Files to Show During Demo

1. **`src/demo.js`** - Basic demonstration
2. **`src/roadmap.test.js`** - Comprehensive test suite
3. **`src/agent.js`** - Main agent implementation
4. **`src/pathGenerator.js`** - Career path generation logic
5. **`src/dataIntegration.js`** - External API integration

## Next Steps for Full Implementation

The remaining tasks in the spec would complete:
- Fix assessment service bug
- Implement Catalyst guidance service
- Add progress tracking to blockchain
- Implement NFT minting
- Add eSIM reward claiming

But the core functionality is **demo-ready right now**!