/**
 * Wallet Manager - Handle Cardano wallet connections
 */

export class WalletManager {
    constructor() {
        this.connectedWallet = null;
        this.walletInfo = null;
        this.availableWallets = [];
    }

    async init() {
        await this.detectWallets();
    }

    async detectWallets() {
        this.availableWallets = [];

        // Wait for wallets to load
        await this.waitForWallets();

        // Check for common Cardano wallets
        const walletChecks = [
            {
                key: 'nami',
                name: 'Nami',
                description: 'Popular Cardano wallet',
                icon: 'https://wallet.nami.io/icon-128.png',
                check: () => window.cardano?.nami
            },
            {
                key: 'eternl',
                name: 'Eternl',
                description: 'Feature-rich Cardano wallet',
                icon: 'https://eternl.io/icons/icon-128.png',
                check: () => window.cardano?.eternl
            },
            {
                key: 'flint',
                name: 'Flint',
                description: 'Simple and secure',
                icon: 'https://flint-wallet.com/icons/icon-128.png',
                check: () => window.cardano?.flint
            },
            {
                key: 'typhon',
                name: 'Typhon',
                description: 'Advanced Cardano wallet',
                icon: 'https://typhonwallet.io/icons/icon-128.png',
                check: () => window.cardano?.typhon
            },
            {
                key: 'begin',
                name: 'Begin Wallet',
                description: 'eSIM-enabled Cardano wallet',
                icon: 'https://beginwallet.com/icons/icon-128.png',
                check: () => window.cardano?.begin
            },
            {
                key: 'yoroi',
                name: 'Yoroi',
                description: 'EMURGO\'s official wallet',
                icon: 'https://yoroi-wallet.com/assets/img/yoroi-logo.png',
                check: () => window.cardano?.yoroi
            },
            {
                key: 'gerowallet',
                name: 'GeroWallet',
                description: 'Multi-platform wallet',
                icon: 'https://gerowallet.io/assets/img/logo.png',
                check: () => window.cardano?.gerowallet
            }
        ];

        for (const wallet of walletChecks) {
            try {
                if (wallet.check()) {
                    this.availableWallets.push(wallet);
                }
            } catch (error) {
                console.warn(`Error checking wallet ${wallet.name}:`, error);
            }
        }

        console.log('Available wallets:', this.availableWallets.map(w => w.name));
        
        // If no wallets found, add demo wallet for testing
        if (this.availableWallets.length === 0) {
            this.availableWallets.push({
                key: 'demo',
                name: 'Demo Wallet',
                description: 'For testing purposes',
                icon: 'https://via.placeholder.com/128x128/4F46E5/FFFFFF?text=DEMO',
                check: () => true
            });
        }
    }

    async waitForWallets(timeout = 3000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            const checkWallets = () => {
                if (window.cardano || Date.now() - startTime > timeout) {
                    resolve();
                } else {
                    setTimeout(checkWallets, 100);
                }
            };
            
            checkWallets();
        });
    }

    getAvailableWallets() {
        return this.availableWallets;
    }

    async connect() {
        if (this.availableWallets.length === 0) {
            throw new Error('No Cardano wallets found. Please install a wallet extension.');
        }
        
        // If only one wallet available, connect directly
        if (this.availableWallets.length === 1) {
            await this.connectWallet(this.availableWallets[0].key);
        }
        
        // Otherwise, let the UI handle wallet selection
        return this.availableWallets;
    }

    async connectWallet(walletKey) {
        try {
            // Handle demo wallet
            if (walletKey === 'demo') {
                return this.connectDemoWallet();
            }

            const walletApi = window.cardano?.[walletKey];
            if (!walletApi) {
                throw new Error(`${walletKey} wallet not found. Please make sure the wallet extension is installed and enabled.`);
            }

            // Check if wallet is enabled
            const isEnabled = await walletApi.isEnabled();
            if (!isEnabled) {
                console.log(`Enabling ${walletKey} wallet...`);
            }

            // Enable the wallet
            const api = await walletApi.enable();
            
            if (!api) {
                throw new Error(`Failed to enable ${walletKey} wallet. Please try again.`);
            }

            // Get wallet info with error handling
            let networkId, balance, changeAddress, usedAddresses;
            
            try {
                networkId = await api.getNetworkId();
            } catch (error) {
                console.warn('Could not get network ID:', error);
                networkId = 0; // Default to testnet
            }

            try {
                balance = await api.getBalance();
            } catch (error) {
                console.warn('Could not get balance:', error);
                balance = '0'; // Default balance
            }

            try {
                changeAddress = await api.getChangeAddress();
            } catch (error) {
                console.warn('Could not get change address:', error);
                changeAddress = '';
            }

            try {
                usedAddresses = await api.getUsedAddresses();
            } catch (error) {
                console.warn('Could not get used addresses:', error);
                usedAddresses = [];
            }
            
            // Store connection info
            this.connectedWallet = {
                key: walletKey,
                api: api,
                networkId: networkId
            };

            this.walletInfo = {
                name: this.getWalletName(walletKey),
                key: walletKey,
                address: this.hexToAddress(usedAddresses[0] || changeAddress),
                balance: this.parseBalance(balance),
                networkId: networkId
            };

            console.log('Wallet connected:', this.walletInfo);
            return this.walletInfo;

        } catch (error) {
            console.error('Failed to connect wallet:', error);
            
            // Provide user-friendly error messages
            if (error.message.includes('User declined')) {
                throw new Error('Connection cancelled by user');
            } else if (error.message.includes('not found')) {
                throw new Error(`${this.getWalletName(walletKey)} wallet not found. Please install the wallet extension.`);
            } else {
                throw new Error(`Failed to connect to ${this.getWalletName(walletKey)}: ${error.message}`);
            }
        }
    }

    connectDemoWallet() {
        // Demo wallet for testing
        this.connectedWallet = {
            key: 'demo',
            api: null,
            networkId: 0
        };

        this.walletInfo = {
            name: 'Demo Wallet',
            key: 'demo',
            address: 'addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7',
            balance: { ada: '100.00', lovelace: 100000000 },
            networkId: 0
        };

        console.log('Demo wallet connected:', this.walletInfo);
        return this.walletInfo;
    }

    async disconnect() {
        this.connectedWallet = null;
        this.walletInfo = null;
        console.log('Wallet disconnected');
    }

    isConnected() {
        return this.connectedWallet !== null;
    }

    getWalletInfo() {
        return this.walletInfo;
    }

    async getAddress() {
        if (!this.isConnected()) {
            throw new Error('Wallet not connected');
        }

        return this.walletInfo.address;
    }

    async getBalance() {
        if (!this.isConnected()) {
            throw new Error('Wallet not connected');
        }

        try {
            const balance = await this.connectedWallet.api.getBalance();
            return this.parseBalance(balance);
        } catch (error) {
            console.error('Failed to get balance:', error);
            throw error;
        }
    }

    async signTransaction(tx) {
        if (!this.isConnected()) {
            throw new Error('Wallet not connected');
        }

        try {
            const signedTx = await this.connectedWallet.api.signTx(tx, true);
            return signedTx;
        } catch (error) {
            console.error('Failed to sign transaction:', error);
            throw error;
        }
    }

    async submitTransaction(signedTx) {
        if (!this.isConnected()) {
            throw new Error('Wallet not connected');
        }

        try {
            const txHash = await this.connectedWallet.api.submitTx(signedTx);
            return txHash;
        } catch (error) {
            console.error('Failed to submit transaction:', error);
            throw error;
        }
    }

    // Helper methods
    getWalletName(key) {
        const names = {
            'nami': 'Nami',
            'eternl': 'Eternl',
            'flint': 'Flint',
            'typhon': 'Typhon',
            'begin': 'Begin Wallet'
        };
        return names[key] || key;
    }

    hexToAddress(hex) {
        try {
            // This is a simplified conversion - in production, use proper Cardano address libraries
            if (!hex) return '';
            
            // For demo purposes, return a mock address format
            if (hex.startsWith('01')) {
                return `addr1${hex.slice(2, 50)}...`;
            } else if (hex.startsWith('00')) {
                return `addr_test1${hex.slice(2, 50)}...`;
            }
            
            return hex.slice(0, 50) + '...';
        } catch (error) {
            console.error('Failed to convert hex to address:', error);
            return hex;
        }
    }

    parseBalance(balanceHex) {
        try {
            // Convert hex balance to ADA
            const lovelace = parseInt(balanceHex, 16);
            const ada = lovelace / 1000000; // 1 ADA = 1,000,000 lovelace
            return {
                ada: ada.toFixed(2),
                lovelace: lovelace
            };
        } catch (error) {
            console.error('Failed to parse balance:', error);
            return { ada: '0.00', lovelace: 0 };
        }
    }

    // Mock payment method for demo
    async createPayment(amount, recipient) {
        if (!this.isConnected()) {
            throw new Error('Wallet not connected');
        }

        // In a real implementation, this would create and submit a transaction
        // For demo purposes, we'll simulate a payment
        console.log(`Creating payment: ${amount} ADA to ${recipient}`);
        
        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Return mock transaction hash
        return {
            txHash: `mock_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: amount,
            recipient: recipient,
            timestamp: Date.now()
        };
    }
}