/**
 * Unit tests for TransactionAnalyzer
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransactionAnalyzer } from './analyzer.js';
import { config } from './config.js';

describe('TransactionAnalyzer', () => {
  let analyzer;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      ...config,
      development: {
        ...config.development,
        enableMockData: true
      }
    };
    analyzer = new TransactionAnalyzer(mockConfig);
  });

  describe('Initialization', () => {
    it('should initialize with config', () => {
      expect(analyzer.config).toBeDefined();
      expect(analyzer.blockfrostProvider).toBeDefined();
    });

    it('should use default config if none provided', () => {
      const defaultAnalyzer = new TransactionAnalyzer();
      expect(defaultAnalyzer.config).toBe(config);
    });
  });

  describe('Address Validation', () => {
    it('should validate correct Cardano addresses', () => {
      const validAddresses = [
        'addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7',
        'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjmg',
        'stake_test1uqevw2xnsc0pvn9t9r9c928uwfrmqc77e85y4qhzuracvgqp8tpse',
        'stake1uyehkck0lajq8gr28t9uxnuvgcqrc6070x3k9r8048z8y5gh6ffgw'
      ];

      validAddresses.forEach(address => {
        expect(TransactionAnalyzer.isValidCardanoAddress(address)).toBe(true);
      });
    });

    it('should reject invalid addresses', () => {
      const invalidAddresses = [
        '',
        null,
        undefined,
        'invalid_address',
        'addr_short',
        '1234567890',
        'bitcoin_address_1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      ];

      invalidAddresses.forEach(address => {
        expect(TransactionAnalyzer.isValidCardanoAddress(address)).toBe(false);
      });
    });
  });

  describe('Experience Level Determination', () => {
    it('should classify beginner users correctly', () => {
      const beginnerTransactions = [
        { type: 'transfer', assets: [{ unit: 'lovelace', quantity: '2000000' }] }
      ];

      const level = analyzer.determineExperienceLevel(beginnerTransactions);
      expect(level).toBe('beginner');
    });

    it('should classify intermediate users correctly', () => {
      const intermediateTransactions = [
        { type: 'transfer' },
        { type: 'transfer' },
        { type: 'nft' },
        { type: 'transfer' },
        { type: 'defi' }
      ];

      const level = analyzer.determineExperienceLevel(intermediateTransactions);
      expect(level).toBe('intermediate');
    });

    it('should classify advanced users correctly', () => {
      const advancedTransactions = Array(25).fill(null).map((_, i) => ({
        type: ['transfer', 'nft', 'defi', 'governance', 'staking'][i % 5]
      }));

      const level = analyzer.determineExperienceLevel(advancedTransactions);
      expect(level).toBe('advanced');
    });
  });

  describe('Technical Skills Extraction', () => {
    it('should extract NFT skills', () => {
      const nftTransactions = [
        { type: 'nft', assets: [{ unit: 'nft_token', quantity: '1' }] }
      ];

      const skills = analyzer.extractTechnicalSkills(nftTransactions);
      expect(skills).toContain('nft');
      expect(skills).toContain('dapp-interaction');
    });

    it('should extract DeFi skills', () => {
      const defiTransactions = [
        { 
          type: 'defi', 
          assets: [
            { unit: 'lovelace', quantity: '2000000' },
            { unit: 'sundae_token', quantity: '100' }
          ]
        }
      ];

      const skills = analyzer.extractTechnicalSkills(defiTransactions);
      expect(skills).toContain('defi');
      expect(skills).toContain('dapp-interaction');
      expect(skills).toContain('sundaeswap');
    });

    it('should extract governance skills', () => {
      const governanceTransactions = [
        { type: 'governance', metadata: { '61284': { vote: 'yes' } } }
      ];

      const skills = analyzer.extractTechnicalSkills(governanceTransactions);
      expect(skills).toContain('governance');
      expect(skills).toContain('drep');
      expect(skills).toContain('catalyst');
    });

    it('should extract Begin Wallet skills', () => {
      const beginWalletTransactions = [
        { type: 'begin-wallet', metadata: { '100': { progress: 'milestone' } } }
      ];

      const skills = analyzer.extractTechnicalSkills(beginWalletTransactions);
      expect(skills).toContain('begin-wallet');
      expect(skills).toContain('metadata-interaction');
      expect(skills).toContain('dapp-discovery');
    });

    it('should add foundational skills based on transaction count', () => {
      const manyTransactions = Array(10).fill({ type: 'transfer' });
      const skills = analyzer.extractTechnicalSkills(manyTransactions);
      
      expect(skills).toContain('wallet-management');
      expect(skills).toContain('transaction-analysis');
    });
  });

  describe('DeFi Protocol Skills Extraction', () => {
    it('should identify SundaeSwap interactions', () => {
      const skills = new Set();
      const transaction = {
        assets: [{ unit: 'sundae_token_123', quantity: '100' }]
      };

      analyzer.extractDeFiProtocolSkills(transaction, skills);
      expect(skills.has('sundaeswap')).toBe(true);
    });

    it('should identify Liqwid interactions', () => {
      const skills = new Set();
      const transaction = {
        assets: [{ unit: 'liqwid_lq_token', quantity: '50' }]
      };

      analyzer.extractDeFiProtocolSkills(transaction, skills);
      expect(skills.has('liqwid')).toBe(true);
    });

    it('should identify multiple protocols', () => {
      const skills = new Set();
      const transaction = {
        assets: [
          { unit: 'sundae_token', quantity: '100' },
          { unit: 'minswap_token', quantity: '200' }
        ]
      };

      analyzer.extractDeFiProtocolSkills(transaction, skills);
      expect(skills.has('sundaeswap')).toBe(true);
      expect(skills.has('minswap')).toBe(true);
    });
  });

  describe('Interest Extraction', () => {
    it('should identify collecting interests from NFT activity', () => {
      const nftTransactions = [
        { type: 'nft' },
        { type: 'nft' },
        { type: 'nft' }
      ];

      const interests = analyzer.extractInterests(nftTransactions);
      expect(interests).toContain('collecting');
      expect(interests).toContain('art');
      expect(interests).toContain('digital-assets');
    });

    it('should identify trading interests from DeFi activity', () => {
      const defiTransactions = [
        { type: 'defi' },
        { type: 'defi' }
      ];

      const interests = analyzer.extractInterests(defiTransactions);
      expect(interests).toContain('trading');
      expect(interests).toContain('yield-farming');
      expect(interests).toContain('financial-innovation');
    });

    it('should identify governance interests', () => {
      const governanceTransactions = [
        { type: 'governance' }
      ];

      const interests = analyzer.extractInterests(governanceTransactions);
      expect(interests).toContain('governance');
      expect(interests).toContain('community-building');
      expect(interests).toContain('decentralization');
    });

    it('should provide default interests for new users', () => {
      const noTransactions = [];
      const interests = analyzer.extractInterests(noTransactions);
      
      expect(interests).toContain('learning');
      expect(interests).toContain('blockchain-technology');
    });
  });

  describe('Learning Style Determination', () => {
    it('should identify experiential learners', () => {
      const diverseTransactions = Array(15).fill(null).map((_, i) => ({
        type: ['transfer', 'nft', 'defi', 'governance'][i % 4]
      }));

      const style = analyzer.determineLearningStyle(diverseTransactions);
      expect(style).toBe('experiential');
    });

    it('should identify visual learners', () => {
      const visualTransactions = [
        { type: 'nft' },
        { type: 'transfer' }
      ];

      const style = analyzer.determineLearningStyle(visualTransactions);
      expect(style).toBe('visual');
    });

    it('should identify theoretical learners', () => {
      const minimalTransactions = [
        { type: 'transfer' }
      ];

      const style = analyzer.determineLearningStyle(minimalTransactions);
      expect(style).toBe('theoretical');
    });
  });

  describe('Career Path Determination', () => {
    it('should recommend development path for DeFi users', () => {
      const transactions = [{ type: 'defi' }];
      const skills = ['defi', 'dapp-interaction'];
      const interests = ['financial-innovation'];

      const path = analyzer.determinePreferredPath(transactions, skills, interests);
      expect(path).toBe('development');
    });

    it('should recommend design path for NFT collectors', () => {
      const transactions = [{ type: 'nft' }];
      const skills = ['nft'];
      const interests = ['art', 'collecting'];

      const path = analyzer.determinePreferredPath(transactions, skills, interests);
      expect(path).toBe('design');
    });

    it('should recommend community path for governance participants', () => {
      const transactions = [{ type: 'governance' }];
      const skills = ['governance', 'catalyst'];
      const interests = ['community-building', 'decentralization'];

      const path = analyzer.determinePreferredPath(transactions, skills, interests);
      expect(path).toBe('community');
    });

    it('should recommend research path for theoretical learners', () => {
      const transactions = [];
      const skills = [];
      const interests = ['blockchain-technology'];

      const path = analyzer.determinePreferredPath(transactions, skills, interests);
      expect(path).toBe('research');
    });

    it('should default to development path when no clear preference', () => {
      const transactions = [{ type: 'transfer' }, { type: 'transfer' }, { type: 'transfer' }]; // 3+ transactions to avoid research path
      const skills = ['wallet-management'];
      const interests = ['learning'];

      const path = analyzer.determinePreferredPath(transactions, skills, interests);
      expect(path).toBe('development');
    });
  });

  describe('Transaction Classification', () => {
    it('should classify NFT transactions', () => {
      const utxo = {
        output: {
          amount: [
            { unit: 'lovelace', quantity: '2000000' },
            { unit: 'nft_token_123', quantity: '1' }
          ]
        }
      };
      const txDetails = { metadata: {} };

      const type = analyzer.classifyTransaction(utxo, txDetails);
      expect(type).toBe('nft');
    });

    it('should classify DeFi transactions', () => {
      const utxo = {
        output: {
          amount: [
            { unit: 'lovelace', quantity: '2000000' },
            { unit: 'token_a', quantity: '100' },
            { unit: 'token_b', quantity: '200' }
          ]
        }
      };
      const txDetails = { metadata: {} };

      const type = analyzer.classifyTransaction(utxo, txDetails);
      expect(type).toBe('defi');
    });

    it('should classify governance transactions', () => {
      const utxo = {
        output: {
          amount: [{ unit: 'lovelace', quantity: '2000000' }]
        }
      };
      const txDetails = {
        metadata: { '61284': { vote: 'yes' } }
      };

      const type = analyzer.classifyTransaction(utxo, txDetails);
      expect(type).toBe('governance');
    });

    it('should classify Begin Wallet transactions', () => {
      const utxo = {
        output: {
          amount: [{ unit: 'lovelace', quantity: '2000000' }]
        }
      };
      const txDetails = {
        metadata: { '100': { progress: 'milestone' } }
      };

      const type = analyzer.classifyTransaction(utxo, txDetails);
      expect(type).toBe('begin-wallet');
    });
  });

  describe('Mock Transaction Data', () => {
    it('should generate advanced user data for addresses ending with "a"', () => {
      const address = 'test_address_a';
      const mockData = analyzer.getMockTransactionData(address);

      expect(mockData.length).toBe(3);
      expect(mockData.some(tx => tx.type === 'defi')).toBe(true);
      expect(mockData.some(tx => tx.type === 'nft')).toBe(true);
      expect(mockData.some(tx => tx.type === 'governance')).toBe(true);
    });

    it('should generate NFT collector data for addresses ending with "b"', () => {
      const address = 'test_address_b';
      const mockData = analyzer.getMockTransactionData(address);

      expect(mockData.length).toBe(2);
      expect(mockData.every(tx => tx.type === 'nft')).toBe(true);
    });

    it('should generate Begin Wallet user data for addresses ending with "c"', () => {
      const address = 'test_address_c';
      const mockData = analyzer.getMockTransactionData(address);

      expect(mockData.length).toBe(2);
      expect(mockData.some(tx => tx.type === 'begin-wallet')).toBe(true);
      expect(mockData[0].metadata['100']).toBeDefined();
    });

    it('should generate beginner data for other addresses', () => {
      const address = 'test_address_z';
      const mockData = analyzer.getMockTransactionData(address);

      expect(mockData.length).toBe(1);
      expect(mockData[0].type).toBe('transfer');
    });
  });

  describe('Full Analysis Integration', () => {
    it('should analyze advanced DeFi user profile', async () => {
      const address = 'test_address_a';
      
      const profile = await analyzer.analyzeUserBackground(address);
      
      expect(profile.address).toBe(address);
      expect(profile.experienceLevel).toBe('beginner'); // 3 transactions = beginner
      expect(profile.technicalSkills).toContain('defi');
      expect(profile.technicalSkills).toContain('nft');
      expect(profile.technicalSkills).toContain('governance');
      expect(profile.interests).toContain('governance'); // governance transactions create governance interest
      expect(profile.preferredPath).toBe('community'); // governance activity leads to community path
      expect(profile.transactionCount).toBe(3);
      expect(profile.analysisTimestamp).toBeDefined();
    });

    it('should analyze NFT collector profile', async () => {
      const address = 'test_address_b';
      
      const profile = await analyzer.analyzeUserBackground(address);
      
      expect(profile.experienceLevel).toBe('beginner');
      expect(profile.technicalSkills).toContain('nft');
      expect(profile.interests).toContain('collecting'); // 2 NFT transactions should trigger collecting
      expect(profile.interests).toContain('art');
      expect(profile.preferredPath).toBe('design');
    });

    it('should analyze Begin Wallet user profile', async () => {
      const address = 'test_address_c';
      
      const profile = await analyzer.analyzeUserBackground(address);
      
      expect(profile.technicalSkills).toContain('begin-wallet');
      expect(profile.technicalSkills).toContain('metadata-interaction');
      expect(profile.interests).toContain('real-world-utility');
    });

    it('should return default profile for new users', async () => {
      const address = 'test_address_z';
      
      const profile = await analyzer.analyzeUserBackground(address);
      
      expect(profile.experienceLevel).toBe('beginner');
      expect(profile.technicalSkills).toContain('wallet-management'); // 1 transaction should add wallet-management
      expect(profile.interests).toContain('learning');
      expect(profile.preferredPath).toBe('research'); // Single transaction users get research path (theoretical learners)
    });
  });

  describe('Error Handling', () => {
    it('should return default profile on analysis error', async () => {
      // Create analyzer that will fail by mocking the fetchTransactionHistory method
      const failingAnalyzer = new TransactionAnalyzer(mockConfig);
      failingAnalyzer.fetchTransactionHistory = vi.fn().mockRejectedValue(new Error('Network error'));

      const address = 'addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7';
      const profile = await failingAnalyzer.analyzeUserBackground(address);
      
      expect(profile.isDefault).toBe(true);
      expect(profile.experienceLevel).toBe('beginner');
      expect(profile.errorMessage).toBeDefined();
    });

    it('should handle invalid address gracefully', async () => {
      // Mock the analyzer to throw an error for invalid addresses
      const testAnalyzer = new TransactionAnalyzer(mockConfig);
      testAnalyzer.fetchTransactionHistory = vi.fn().mockRejectedValue(new Error('Invalid address'));
      
      const invalidAddress = 'invalid_address';
      const profile = await testAnalyzer.analyzeUserBackground(invalidAddress);
      
      expect(profile.address).toBe(invalidAddress);
      expect(profile.isDefault).toBe(true);
    });
  });

  describe('Default Profile Generation', () => {
    it('should generate consistent default profile', () => {
      const address = 'test_address';
      const profile = analyzer.getDefaultProfile(address);
      
      expect(profile.address).toBe(address);
      expect(profile.experienceLevel).toBe('beginner');
      expect(profile.technicalSkills).toEqual(['wallet-management']);
      expect(profile.interests).toEqual(['learning', 'blockchain-technology']);
      expect(profile.learningStyle).toBe('theoretical');
      expect(profile.preferredPath).toBe('development');
      expect(profile.transactionCount).toBe(0);
      expect(profile.isDefault).toBe(true);
      expect(profile.analysisTimestamp).toBeDefined();
    });

    it('should include error message when provided', () => {
      const address = 'test_address';
      const errorMessage = 'Network error';
      const profile = analyzer.getDefaultProfile(address, errorMessage);
      
      expect(profile.errorMessage).toBe(errorMessage);
    });
  });
});