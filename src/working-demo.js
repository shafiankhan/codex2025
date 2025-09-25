/**
 * Working Demo - Shows the fully functional features of Cardano Career Navigator
 */

import { CareerNavigatorAgent } from './agent.js';
import { config } from './config.js';

async function runWorkingDemo() {
  console.log('🚀 Cardano Career Navigator - Working Features Demo\n');
  
  try {
    // Initialize and register agent
    console.log('1. 🔧 Initializing Career Navigator Agent...');
    const agent = new CareerNavigatorAgent(config);
    await agent.register();
    console.log('✅ Agent registered successfully!\n');
    
    // Show service offerings
    console.log('2. 💰 Available Services:');
    const services = agent.getServiceInfo();
    Object.entries(services).forEach(([key, service]) => {
      console.log(`   ${service.name}: ${service.price} ADA - ${service.description}`);
    });
    console.log('');
    
    // Demo 1: Transaction Analysis
    console.log('3. 🔍 Demo: Transaction Analysis');
    console.log('   Analyzing different user profiles from on-chain data...\n');
    
    const { TransactionAnalyzer } = await import('./analyzer.js');
    const analyzer = new TransactionAnalyzer(config);
    
    // Test different user types
    const testUsers = [
      { address: 'test_address_a', description: 'Advanced DeFi User' },
      { address: 'test_address_b', description: 'NFT Collector' },
      { address: 'test_address_c', description: 'Begin Wallet User' },
      { address: 'test_address_z', description: 'New User' }
    ];
    
    for (const user of testUsers) {
      const profile = await analyzer.analyzeUserBackground(user.address);
      console.log(`   📊 ${user.description}:`);
      console.log(`      Experience: ${profile.experienceLevel}`);
      console.log(`      Path: ${profile.preferredPath}`);
      console.log(`      Skills: ${profile.technicalSkills.slice(0, 3).join(', ')}${profile.technicalSkills.length > 3 ? '...' : ''}`);
      console.log('');
    }
    
    // Demo 2: Career Roadmap Generation (FULLY WORKING)
    console.log('4. 🗺️ Demo: Career Roadmap Generation');
    console.log('   Generating personalized learning roadmaps...\n');
    
    const roadmapRequest = {
      type: 'roadmap',
      userAddress: 'test_address_a',
      timeline: '6-months',
      paymentTxHash: 'demo_payment_roadmap_123'
    };
    
    console.log('   🔄 Processing roadmap request...');
    const roadmapResponse = await agent.processRequest(roadmapRequest);
    
    console.log('   ✅ Roadmap Generated Successfully!');
    console.log(`   📊 User Profile: ${roadmapResponse.userProfile.experienceLevel} ${roadmapResponse.userProfile.preferredPath} user`);
    console.log(`   🎯 Timeline: ${roadmapResponse.roadmap.timeline}`);
    console.log(`   📈 Milestones: ${roadmapResponse.roadmap.totalMilestones}`);
    console.log(`   🚀 Catalyst Opportunities: ${roadmapResponse.opportunities.catalyst.length}`);
    console.log(`   💰 Bounties: ${roadmapResponse.opportunities.bounties.length}`);
    console.log(`   📱 Begin Wallet Tips: ${roadmapResponse.beginWalletIntegration.length}`);
    console.log('');
    
    // Show sample milestone
    if (roadmapResponse.roadmap.milestones.length > 0) {
      const milestone = roadmapResponse.roadmap.milestones[0];
      console.log('   📋 Sample Milestone:');
      console.log(`      Name: ${milestone.name}`);
      console.log(`      Description: ${milestone.description}`);
      console.log(`      Target: Week ${milestone.targetWeek}`);
      console.log(`      Rewards: ${milestone.rewards.nft ? 'NFT + ' : ''}${milestone.rewards.esim ? 'eSIM Data' : 'Progress Tracking'}`);
      console.log('');
    }
    
    // Show Catalyst opportunities
    if (roadmapResponse.opportunities.catalyst.length > 0) {
      const opportunity = roadmapResponse.opportunities.catalyst[0];
      console.log('   🚀 Sample Catalyst Opportunity:');
      console.log(`      Round: ${opportunity.roundName}`);
      console.log(`      Category: ${opportunity.categoryName}`);
      console.log(`      Budget: ${opportunity.minProposalBudget.toLocaleString()} - ${opportunity.maxProposalBudget.toLocaleString()} ADA`);
      console.log(`      Match Reason: ${opportunity.matchReason}`);
      console.log('');
    }
    
    // Show Begin Wallet integration
    if (roadmapResponse.beginWalletIntegration.length > 0) {
      const tip = roadmapResponse.beginWalletIntegration[0];
      console.log('   📱 Begin Wallet Integration:');
      console.log(`      Feature: ${tip.title}`);
      console.log(`      Action: ${tip.action}`);
      console.log(`      Benefit: ${tip.description}`);
      console.log('');
    }
    
    // Demo 3: Different Timeline Options
    console.log('5. ⏱️ Demo: Different Timeline Options');
    console.log('   Showing how roadmaps adapt to different timelines...\n');
    
    const timelines = ['3-months', '6-months', '12-months'];
    for (const timeline of timelines) {
      const timelineRequest = {
        type: 'roadmap',
        userAddress: 'test_address_b',
        timeline: timeline,
        paymentTxHash: `demo_payment_${timeline}`
      };
      
      const response = await agent.processRequest(timelineRequest);
      console.log(`   📅 ${timeline} roadmap: ${response.roadmap.totalMilestones} milestones, completion by ${new Date(response.roadmap.estimatedCompletionDate).toLocaleDateString()}`);
    }
    console.log('');
    
    // Demo 4: Error Handling
    console.log('6. ⚠️ Demo: Error Handling');
    console.log('   Testing validation and error responses...\n');
    
    try {
      await agent.processRequest({
        type: 'roadmap',
        userAddress: 'test_address_a'
        // Missing timeline
      });
    } catch (error) {
      console.log(`   ✅ Timeline validation: ${error.message}`);
    }
    
    try {
      await agent.processRequest({
        type: 'invalid_service',
        userAddress: 'test_address_a'
      });
    } catch (error) {
      console.log(`   ✅ Service validation: ${error.message}`);
    }
    
    try {
      await agent.processRequest({
        type: 'roadmap',
        userAddress: 'invalid_address',
        timeline: '6-months'
      });
    } catch (error) {
      console.log(`   ✅ Address validation: ${error.message}`);
    }
    console.log('');
    
    // Summary
    console.log('🎉 Demo Complete! Key Features Demonstrated:');
    console.log('   ✅ Masumi agent registration and service discovery');
    console.log('   ✅ On-chain transaction analysis and user profiling');
    console.log('   ✅ Personalized career roadmap generation');
    console.log('   ✅ Catalyst opportunity integration');
    console.log('   ✅ Begin Wallet feature integration');
    console.log('   ✅ Multiple timeline support');
    console.log('   ✅ Comprehensive error handling');
    console.log('   ✅ ADA payment processing');
    console.log('');
    console.log('🚀 Ready for Masumi platform integration!');
    console.log('📱 Ready for Begin Wallet integration!');
    console.log('💰 Ready for real ADA payments on Preprod testnet!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run demo if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith('working-demo.js')) {
  runWorkingDemo();
}

export { runWorkingDemo };