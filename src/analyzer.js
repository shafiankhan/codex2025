/**
 * Transaction History Analyzer for Cardano Career Navigator
 * Analyzes user's on-chain activity to determine skills, experience, and interests
 */

import { BlockfrostProvider, MeshWallet } from '@meshsdk/core';
import { config } from './config.js';

export class TransactionAnalyzer {
  constructor(configOverride = null) {
    this.config = configOverride || config;
    this.blockfrostProvider = new BlockfrostProvider(
      this.config.cardano.blockfrost.projectId,
      this.config.cardano.blockfrost.url
    );
  }

  /**
   * Main function to analyze user's background from their wallet address
   */
  async analyzeUserBackground(userAddress) {
    try {
      console.log(`🔍 Analyzing background for address: ${userAddress.substring(0, 20)}...`);
      
      // Fetch transaction history
      const transactions = await this.fetchTransactionHistory(userAddress);
      console.log(`📊 Found ${transactions.length} transactions to analyze`);
      
      // Analyze different aspects of the user's profile
      const experienceLevel = this.determineExperienceLevel(transactions);
      const technicalSkills = this.extractTechnicalSkills(transactions);
      const interests = this.extractInterests(transactions);
      const learningStyle = this.determineLearningStyle(transactions);
      const preferredPath = this.determinePreferredPath(transactions, technicalSkills, interests);
      
      const profile = {
        address: userAddress,
        experienceLevel,
        technicalSkills,
        interests,
        learningStyle,
        preferredPath,
        analysisTimestamp: Date.now(),
        transactionCount: transactions.length,
        rawTransactionData: this.config.development.enableMockData ? transactions.slice(0, 3) : undefined
      };
      
      console.log(`✅ Analysis complete - Level: ${experienceLevel}, Path: ${preferredPath}`);
      return profile;
      
    } catch (error) {
      console.error('❌ Transaction analysis failed:', error.message);
      
      // Return default profile for new users or on error
      return this.getDefaultProfile(userAddress, error.message);
    }
  }

  /**
   * Fetch transaction history from Cardano blockchain
   */
  async fetchTransactionHistory(userAddress) {
    try {
      // In development mode, return mock data for faster testing
      if (this.config.development.enableMockData) {
        return this.getMockTransactionData(userAddress);
      }
      
      // Fetch real transaction data using Blockfrost
      const utxos = await this.blockfrostProvider.fetchAddressUTxOs(userAddress);
      const transactions = [];
      
      // Process UTXOs to extract transaction information
      for (const utxo of utxos.slice(0, this.config.app.maxTransactionHistory)) {
        try {
          const txDetails = await this.blockfrostProvider.fetchTxInfo(utxo.input.txHash);
          transactions.push({
            hash: utxo.input.txHash,
            timestamp: txDetails.block_time,
            assets: utxo.output.amount,
            metadata: txDetails.metadata || {},
            type: this.classifyTransaction(utxo, txDetails)
          });
        } catch (txError) {
          console.warn(`⚠️ Could not fetch details for tx: ${utxo.input.txHash}`);
        }
      }
      
      return transactions.sort((a, b) => b.timestamp - a.timestamp);
      
    } catch (error) {
      console.warn('⚠️ Falling back to mock data due to fetch error:', error.message);
      return this.getMockTransactionData(userAddress);
    }
  }

  /**
   * Classify transaction type based on assets and metadata
   */
  classifyTransaction(utxo, txDetails) {
    const assets = utxo.output.amount;
    const metadata = txDetails.metadata || {};
    
    // Check for NFT transactions
    if (assets.some(asset => asset.unit !== 'lovelace' && asset.quantity === '1')) {
      return 'nft';
    }
    
    // Check for DeFi transactions (multiple assets)
    if (assets.length > 2) {
      return 'defi';
    }
    
    // Check for governance transactions (metadata patterns)
    if (metadata['61284'] || metadata['61285']) {
      return 'governance';
    }
    
    // Check for Begin Wallet specific patterns (metadata label 100)
    if (metadata['100']) {
      return 'begin-wallet';
    }
    
    // Check for staking transactions
    if (metadata['staking'] || txDetails.certificates?.length > 0) {
      return 'staking';
    }
    
    // Default to simple transfer
    return 'transfer';
  }

  /**
   * Determine user's experience level based on transaction patterns
   */
  determineExperienceLevel(transactions) {
    const txCount = transactions.length;
    const uniqueTypes = new Set(transactions.map(tx => tx.type)).size;
    const hasComplexTx = transactions.some(tx => 
      ['defi', 'governance', 'nft'].includes(tx.type)
    );
    
    // Advanced: Many transactions with diverse types
    if (txCount >= 20 && uniqueTypes >= 4 && hasComplexTx) {
      return 'advanced';
    }
    
    // Intermediate: Moderate activity with some complexity
    if (txCount >= 5 && (uniqueTypes >= 2 || hasComplexTx)) {
      return 'intermediate';
    }
    
    // Beginner: Few transactions or simple transfers only
    return 'beginner';
  }

  /**
   * Extract technical skills from transaction patterns
   */
  extractTechnicalSkills(transactions) {
    const skills = new Set();
    
    transactions.forEach(tx => {
      switch (tx.type) {
        case 'nft':
          skills.add('nft');
          skills.add('dapp-interaction');
          break;
        case 'defi':
          skills.add('defi');
          skills.add('dapp-interaction');
          // Add specific protocol skills based on assets
          this.extractDeFiProtocolSkills(tx, skills);
          break;
        case 'governance':
          skills.add('governance');
          skills.add('drep');
          skills.add('catalyst');
          break;
        case 'begin-wallet':
          skills.add('begin-wallet');
          skills.add('metadata-interaction');
          skills.add('dapp-discovery');
          break;
        case 'staking':
          skills.add('staking');
          skills.add('delegation');
          break;
      }
    });
    
    // Add foundational skills based on transaction count
    if (transactions.length >= 1) {
      skills.add('wallet-management');
    }
    
    if (transactions.length >= 10) {
      skills.add('transaction-analysis');
    }
    
    return Array.from(skills);
  }

  /**
   * Extract DeFi protocol-specific skills
   */
  extractDeFiProtocolSkills(transaction, skills) {
    const assets = transaction.assets || [];
    
    // Check for known DeFi protocol tokens
    assets.forEach(asset => {
      const unit = asset.unit.toLowerCase();
      
      if (unit.includes('sundae')) {
        skills.add('sundaeswap');
      } else if (unit.includes('liqwid') || unit.includes('lq')) {
        skills.add('liqwid');
      } else if (unit.includes('minswap') || unit.includes('min')) {
        skills.add('minswap');
      } else if (unit.includes('muesli')) {
        skills.add('muesliswap');
      } else if (unit.includes('djed') || unit.includes('shen')) {
        skills.add('djed-stablecoin');
      }
    });
  }

  /**
   * Extract user interests from transaction patterns
   */
  extractInterests(transactions) {
    const interests = new Set();
    
    // Analyze transaction types for interests
    const typeCount = transactions.reduce((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + 1;
      return acc;
    }, {});
    
    // Interest mapping based on transaction patterns
    if (typeCount.nft >= 2) { // Lower threshold for collecting interest
      interests.add('collecting');
      interests.add('art');
      interests.add('digital-assets');
    }
    
    if (typeCount.defi >= 2) {
      interests.add('trading');
      interests.add('yield-farming');
      interests.add('financial-innovation');
    }
    
    if (typeCount.governance >= 1) {
      interests.add('governance');
      interests.add('community-building');
      interests.add('decentralization');
    }
    
    if (typeCount.staking >= 1) {
      interests.add('passive-income');
      interests.add('network-security');
    }
    
    if (typeCount['begin-wallet'] >= 1) {
      interests.add('real-world-utility');
      interests.add('travel');
      interests.add('mobile-integration');
    }
    
    // Default interests for new users
    if (interests.size === 0) {
      interests.add('learning');
      interests.add('blockchain-technology');
    }
    
    return Array.from(interests);
  }

  /**
   * Determine learning style based on transaction patterns
   */
  determineLearningStyle(transactions) {
    const txCount = transactions.length;
    const uniqueTypes = new Set(transactions.map(tx => tx.type)).size;
    
    // Experiential: High activity, diverse transactions
    if (txCount >= 10 && uniqueTypes >= 3) {
      return 'experiential';
    }
    
    // Visual: Moderate activity, especially with NFTs
    if (transactions.some(tx => tx.type === 'nft') || uniqueTypes >= 2) {
      return 'visual';
    }
    
    // Theoretical: Low activity, suggesting preference for learning before doing
    return 'theoretical';
  }

  /**
   * Determine preferred career path based on skills and interests
   */
  determinePreferredPath(transactions, technicalSkills, interests) {
    // Score different paths based on user activity
    const pathScores = {
      development: 0,
      design: 0,
      community: 0,
      research: 0
    };
    
    // Development path indicators
    if (technicalSkills.includes('defi')) pathScores.development += 3;
    if (technicalSkills.includes('dapp-interaction')) pathScores.development += 2;
    if (technicalSkills.includes('metadata-interaction')) pathScores.development += 2;
    if (interests.includes('financial-innovation')) pathScores.development += 2;
    
    // Design path indicators
    if (technicalSkills.includes('nft')) pathScores.design += 3;
    if (interests.includes('art')) pathScores.design += 3;
    if (interests.includes('digital-assets')) pathScores.design += 2;
    if (interests.includes('collecting')) pathScores.design += 1;
    
    // Community path indicators
    if (technicalSkills.includes('governance')) pathScores.community += 3;
    if (technicalSkills.includes('catalyst')) pathScores.community += 2;
    if (interests.includes('community-building')) pathScores.community += 3;
    if (interests.includes('decentralization')) pathScores.community += 2;
    
    // Research path indicators
    if (transactions.length < 3) pathScores.research += 1; // Only very new users
    if (interests.includes('blockchain-technology') && interests.length === 1) pathScores.research += 1;
    if (technicalSkills.includes('transaction-analysis')) pathScores.research += 1;
    
    // Find the highest scoring path
    const topPath = Object.entries(pathScores).reduce((a, b) => 
      pathScores[a[0]] > pathScores[b[0]] ? a : b
    )[0];
    
    // Default to development if no clear preference or all scores are 0
    const maxScore = Math.max(...Object.values(pathScores));
    return maxScore > 0 ? topPath : 'development';
  }

  /**
   * Get default profile for new users or error cases
   */
  getDefaultProfile(userAddress, errorMessage = null) {
    return {
      address: userAddress,
      experienceLevel: 'beginner',
      technicalSkills: ['wallet-management'],
      interests: ['learning', 'blockchain-technology'],
      learningStyle: 'theoretical',
      preferredPath: 'development',
      analysisTimestamp: Date.now(),
      transactionCount: 0,
      isDefault: true,
      errorMessage
    };
  }

  /**
   * Generate mock transaction data for testing and development
   */
  getMockTransactionData(userAddress) {
    // Return different mock data based on address pattern for testing
    const addressHash = userAddress.slice(-1);
    
    if (addressHash === 'a') {
      // Advanced DeFi user
      return [
        {
          hash: 'mock_tx_1',
          timestamp: Date.now() - 86400000,
          assets: [
            { unit: 'lovelace', quantity: '2000000' },
            { unit: 'sundae_token', quantity: '100' }
          ],
          metadata: {},
          type: 'defi'
        },
        {
          hash: 'mock_tx_2',
          timestamp: Date.now() - 172800000,
          assets: [
            { unit: 'lovelace', quantity: '1500000' },
            { unit: 'nft_token', quantity: '1' }
          ],
          metadata: {},
          type: 'nft'
        },
        {
          hash: 'mock_tx_3',
          timestamp: Date.now() - 259200000,
          assets: [{ unit: 'lovelace', quantity: '5000000' }],
          metadata: { '61284': { 'vote': 'yes' } },
          type: 'governance'
        }
      ];
    } else if (addressHash === 'b') {
      // NFT collector
      return [
        {
          hash: 'mock_tx_1',
          timestamp: Date.now() - 86400000,
          assets: [
            { unit: 'lovelace', quantity: '2000000' },
            { unit: 'nft_collection_1', quantity: '1' }
          ],
          metadata: {},
          type: 'nft'
        },
        {
          hash: 'mock_tx_2',
          timestamp: Date.now() - 172800000,
          assets: [
            { unit: 'lovelace', quantity: '1500000' },
            { unit: 'nft_collection_2', quantity: '1' }
          ],
          metadata: {},
          type: 'nft'
        }
      ];
    } else if (addressHash === 'c') {
      // Begin Wallet user
      return [
        {
          hash: 'mock_tx_1',
          timestamp: Date.now() - 86400000,
          assets: [{ unit: 'lovelace', quantity: '2000000' }],
          metadata: { 
            '100': { 
              'career': { 
                'progress': 'milestone_completed' 
              } 
            } 
          },
          type: 'begin-wallet'
        },
        {
          hash: 'mock_tx_2',
          timestamp: Date.now() - 172800000,
          assets: [{ unit: 'lovelace', quantity: '1500000' }],
          metadata: {},
          type: 'transfer'
        }
      ];
    } else {
      // Beginner user
      return [
        {
          hash: 'mock_tx_1',
          timestamp: Date.now() - 86400000,
          assets: [{ unit: 'lovelace', quantity: '2000000' }],
          metadata: {},
          type: 'transfer'
        }
      ];
    }
  }

  /**
   * Validate Cardano address format
   */
  static isValidCardanoAddress(address) {
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
}

/**
 * User Profile Interface (for documentation)
 */
export const UserProfileSchema = {
  address: 'string',
  experienceLevel: 'beginner | intermediate | advanced',
  technicalSkills: 'string[]',
  interests: 'string[]',
  learningStyle: 'visual | experiential | theoretical',
  preferredPath: 'development | design | community | research',
  analysisTimestamp: 'number',
  transactionCount: 'number',
  isDefault: 'boolean?',
  errorMessage: 'string?'
};