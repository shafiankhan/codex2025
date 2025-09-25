/**
 * Wallet Connection Component
 */

export class WalletConnection {
    constructor(walletManager) {
        this.walletManager = walletManager;
        this.isConnecting = false;
    }

    render(container) {
        container.innerHTML = this.getConnectionHTML();
        this.setupEventListeners();
    }

    getConnectionHTML() {
        if (this.walletManager.isConnected()) {
            const walletInfo = this.walletManager.getWalletInfo();
            return `
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
                        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-wallet text-white text-sm"></i>
                        </div>
                        <div class="text-sm">
                            <div class="font-medium">${walletInfo.name}</div>
                            <div class="text-blue-100">${this.formatAddress(walletInfo.address)}</div>
                        </div>
                    </div>
                    <button id="disconnect-wallet-btn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <i class="fas fa-sign-out-alt mr-2"></i>Disconnect
                    </button>
                </div>
            `;
        } else {
            return `
                <div class="flex items-center space-x-4">
                    <button id="connect-wallet-btn" class="bg-white hover:bg-gray-100 text-blue-600 px-6 py-2 rounded-lg font-semibold transition-colors ${this.isConnecting ? 'opacity-50 cursor-not-allowed' : ''}">
                        ${this.isConnecting ?
                    '<i class="fas fa-spinner fa-spin mr-2"></i>Connecting...' :
                    '<i class="fas fa-wallet mr-2"></i>Connect Wallet'
                }
                    </button>
                </div>
            `;
        }
    }

    setupEventListeners() {
        const connectBtn = document.getElementById('connect-wallet-btn');
        const disconnectBtn = document.getElementById('disconnect-wallet-btn');

        if (connectBtn) {
            connectBtn.addEventListener('click', () => this.connectWallet());
        }

        if (disconnectBtn) {
            disconnectBtn.addEventListener('click', () => this.disconnectWallet());
        }
    }

    async connectWallet() {
        if (this.isConnecting) return;

        this.isConnecting = true;
        this.updateDisplay();

        try {
            const availableWallets = await this.walletManager.connect();

            if (Array.isArray(availableWallets)) {
                this.showWalletSelection();
            } else {
                // Single wallet was connected directly
                this.updateDisplay();

                // Dispatch wallet connected event
                window.dispatchEvent(new CustomEvent('wallet-connected', {
                    detail: this.walletManager.getWalletInfo()
                }));
            }
        } catch (error) {
            console.error('Wallet connection failed:', error);

            if (error.message.includes('No Cardano wallets found')) {
                this.showError('No Cardano wallets found. Please install a wallet like Nami, Eternl, or Begin Wallet, then refresh the page.');
            } else {
                this.showError(`Failed to connect wallet: ${error.message}`);
            }
        } finally {
            this.isConnecting = false;
            this.updateDisplay();
        }
    }

    showWalletSelection() {
        const availableWallets = this.walletManager.getAvailableWallets();

        if (availableWallets.length === 0) {
            this.showError('No Cardano wallets found. Please install a wallet like Nami, Eternl, or Begin Wallet.');
            return;
        }

        // Create wallet selection modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-semibold">Select Wallet</h3>
                    <button id="close-wallet-modal" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="space-y-3">
                    ${availableWallets.map(wallet => `
                        <button class="wallet-option w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors" data-wallet="${wallet.key}">
                            <img src="${wallet.icon}" alt="${wallet.name}" class="w-8 h-8">
                            <div class="text-left">
                                <div class="font-medium">${wallet.name}</div>
                                <div class="text-sm text-gray-500">${wallet.description}</div>
                            </div>
                        </button>
                    `).join('')}
                </div>
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-500 mb-2">Don't have a wallet?</p>
                    <div class="flex justify-center space-x-4 text-sm">
                        <a href="https://namiwallet.io" target="_blank" class="text-blue-600 hover:underline">Get Nami</a>
                        <a href="https://eternl.io" target="_blank" class="text-blue-600 hover:underline">Get Eternl</a>
                        <a href="https://beginwallet.com" target="_blank" class="text-blue-600 hover:underline">Get Begin Wallet</a>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">After installing, refresh this page</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup modal event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.id === 'close-wallet-modal') {
                modal.remove();
            } else if (e.target.closest('.wallet-option')) {
                const walletKey = e.target.closest('.wallet-option').dataset.wallet;
                this.selectWallet(walletKey);
                modal.remove();
            }
        });
    }

    async selectWallet(walletKey) {
        try {
            await this.walletManager.connectWallet(walletKey);
            this.updateDisplay();

            // Dispatch wallet connected event
            window.dispatchEvent(new CustomEvent('wallet-connected', {
                detail: this.walletManager.getWalletInfo()
            }));

        } catch (error) {
            console.error('Failed to connect to wallet:', error);
            this.showError(`Failed to connect to wallet: ${error.message}`);
        }
    }

    async disconnectWallet() {
        try {
            await this.walletManager.disconnect();
            this.updateDisplay();

            // Dispatch wallet disconnected event
            window.dispatchEvent(new CustomEvent('wallet-disconnected'));

        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
            this.showError('Failed to disconnect wallet');
        }
    }

    updateDisplay() {
        const container = document.querySelector('#wallet-connection-container');
        if (container) {
            container.innerHTML = this.getConnectionHTML();
            this.setupEventListeners();
        }
    }

    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 8)}...${address.slice(-8)}`;
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}