#!/usr/bin/env node

/**
 * Demo script for Cardano Career Navigator - Testnet Version
 * Shows enhanced AI responses and testnet features
 */

import { ApiService } from './src/frontend/services/ApiService.js';

console.log('🧪 Cardano Career Navigator - Testnet Demo\n');

const api = new ApiService();

// Demo different user profiles
const testAddresses = [
    'addr_test1_beginner_user',
    'addr_test1_intermediate_dev',
    'addr_test1_advanced_researcher',
    'addr_test1_designer_nft'
];

console.log('👥 Testing AI Responses for Different User Types:\n');

for (let i = 0; i < testAddresses.length; i++) {
    const address = testAddresses[i];
    console.log(`${i + 1}. Testing user: ${address}`);
    console.log('=' .repeat(60));
    
    // Get assessment
    const assessment = api.getMockAssessmentResponse(address);
    console.log(`📊 Profile Analysis:`);
    console.log(`   Experience: ${assessment.profile.experienceLevel}`);
    console.log(`   Path: ${assessment.profile.preferredPath}`);
    console.log(`   Skills: ${assessment.profile.technicalSkills.join(', ')}`);
    console.log(`   Transactions: ${assessment.profile.transactionCount}`);
    console.log(`   Wallet Age: ${assessment.profile.walletAge} days`);
    console.log(`   AI Confidence: ${assessment.aiAnalysis.confidence}%`);
    
    // Get roadmap
    const roadmap = api.getMockRoadmapResponse(address, '6-months');
    console.log(`\n🗺️ Roadmap Generated:`);
    console.log(`   Timeline: ${roadmap.roadmap.timeline}`);
    console.log(`   Milestones: ${roadmap.roadmap.totalMilestones}`);
    console.log(`   Weekly Hours: ${roadmap.roadmap.estimatedWeeklyHours}`);
    console.log(`   Success Rate: ${roadmap.aiInsights.estimatedSuccessRate}%`);
    console.log(`   First Milestone: ${roadmap.roadmap.milestones[0]?.name}`);
    
    // Show opportunities
    console.log(`\n🎯 Opportunities Found:`);
    console.log(`   Catalyst: ${roadmap.opportunities.catalyst.length} relevant`);
    console.log(`   Bounties: ${roadmap.opportunities.bounties.length} matching`);
    
    if (roadmap.opportunities.bounties.length > 0) {
        const topBounty = roadmap.opportunities.bounties[0];
        console.log(`   Top Bounty: ${topBounty.title} (${topBounty.reward} ADA)`);
    }
    
    console.log(`\n💡 Begin Wallet Tips: ${roadmap.beginWalletIntegration.length} personalized tips`);
    console.log('');
}

// Show testnet pricing
console.log('💰 Testnet Pricing:');
console.log('=' .repeat(40));
const services = api.getMockServicesResponse();
Object.entries(services).forEach(([key, service]) => {
    console.log(`${service.name}: ${service.price} ${service.currency}`);
    console.log(`  Features: ${service.features.join(', ')}`);
    console.log('');
});

console.log('🌐 Web Interface:');
console.log('  Start server: npm run serve');
console.log('  Visit: http://localhost:8080');
console.log('  Features: Testnet mode, enhanced AI, Begin Wallet integration');
console.log('');

console.log('🎉 Testnet demo complete! Ready for user testing.');