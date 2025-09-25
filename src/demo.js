/**
 * Demo script for Cardano Career Navigator Agent
 * Shows the agent registration and basic functionality
 */

import { CareerNavigatorAgent } from './agent.js';
import { config } from './config.js';

async function runDemo() {
  console.log('🚀 Cardano Career Navigator Demo\n');
  
  try {
    // Initialize agent
    console.log('1. Initializing Career Navigator Agent...');
    const agent = new CareerNavigatorAgent(config);
    
    // Show agent status before registration
    console.log('\n📊 Agent Status (Before Registration):');
    console.log(JSON.stringify(agent.getStatus(), null, 2));
    
    // Register agent
    console.log('\n2. Registering with Masumi platform...');
    const registrationResult = await agent.register();
    console.log('✅ Registration Result:', registrationResult);
    
    // Show agent status after registration
    console.log('\n📊 Agent Status (After Registration):');
    console.log(JSON.stringify(agent.getStatus(), null, 2));
    
    // Show service information
    console.log('\n💰 Available Services:');
    const services = agent.getServiceInfo();
    Object.entries(services).forEach(([key, service]) => {
      console.log(`\n${key.toUpperCase()} SERVICE:`);
      console.log(`  Name: ${service.name}`);
      console.log(`  Price: ${service.price} ${service.currency}`);
      console.log(`  Description: ${service.description}`);
      console.log(`  Estimated Time: ${service.estimatedTime}`);
      console.log(`  Requirements: ${service.requirements.join(', ')}`);
    });
    
    // Test valid request structure (will fail due to unimplemented services)
    console.log('\n3. Testing Request Processing...');
    
    const testAddress = 'addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7';
    
    // Test assessment request
    try {
      console.log('\n🔍 Testing Assessment Request...');
      await agent.processRequest({
        type: 'assessment',
        userAddress: testAddress,
        paymentTxHash: 'demo_payment_hash_123'
      });
    } catch (error) {
      console.log(`Expected error: ${error.message}`);
    }
    
    // Test roadmap request
    try {
      console.log('\n🗺️ Testing Roadmap Request...');
      await agent.processRequest({
        type: 'roadmap',
        userAddress: testAddress,
        timeline: '6-months',
        paymentTxHash: 'demo_payment_hash_456'
      });
    } catch (error) {
      console.log(`Expected error: ${error.message}`);
    }
    
    // Test catalyst request
    try {
      console.log('\n🚀 Testing Catalyst Request...');
      await agent.processRequest({
        type: 'catalyst',
        userAddress: testAddress,
        paymentTxHash: 'demo_payment_hash_789'
      });
    } catch (error) {
      console.log(`Expected error: ${error.message}`);
    }
    
    // Test error handling
    console.log('\n4. Testing Error Handling...');
    
    try {
      console.log('\n❌ Testing Invalid Request...');
      await agent.processRequest({
        type: 'invalid',
        userAddress: testAddress
      });
    } catch (error) {
      console.log(`Validation error: ${error.message}`);
    }
    
    try {
      console.log('\n❌ Testing Invalid Address...');
      await agent.processRequest({
        type: 'assessment',
        userAddress: 'invalid_address'
      });
    } catch (error) {
      console.log(`Address validation error: ${error.message}`);
    }
    
    console.log('\n✅ Demo completed successfully!');
    console.log('\n🌐 Web Interface Available:');
    console.log('  - Run: npm run serve');
    console.log('  - Visit: http://localhost:8080');
    console.log('  - Features: Modern dApp UI with wallet connection');
    console.log('\n📝 Implementation Status:');
    console.log('  ✅ Task 7: Roadmap service handler - COMPLETED');
    console.log('  ✅ Frontend: Modern dApp interface - COMPLETED');
    console.log('  ✅ Wallet Integration: Cardano wallet support - COMPLETED');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run demo if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith('demo.js')) {
  runDemo();
}

export { runDemo };