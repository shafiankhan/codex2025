/**
 * Main dApp Component for Cardano Career Navigator
 */

import { WalletManager } from '../services/WalletManager.js';
import { ChatInterface } from './ChatInterface.js';
import { ServiceCards } from './ServiceCards.js';
import { WalletConnection } from './WalletConnection.js';

export class CareerNavigatorDApp {
    constructor() {
        this.walletManager = new WalletManager();
        this.chatInterface = null;
        this.serviceCards = null;
        this.walletConnection = null;
        this.currentView = 'home'; // home, chat, services
    }

    async init() {
        this.render();
        this.setupEventListeners();
        await this.walletManager.init();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <!-- Header -->
                <header class="cardano-blue text-white shadow-lg">
                    <div class="container mx-auto px-4 py-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-compass text-2xl"></i>
                                </div>
                                <div>
                                    <div class="flex items-center space-x-2">
                                        <h1 class="text-2xl font-bold">Cardano Career Navigator</h1>
                                        <span class="bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">TESTNET</span>
                                    </div>
                                    <p class="text-blue-100">Your AI-powered career guide in the Cardano ecosystem</p>
                                </div>
                            </div>
                            <div id="wallet-connection-container"></div>
                        </div>
                    </div>
                </header>

                <!-- Testnet Notice -->
                <div class="bg-yellow-100 border-b border-yellow-200">
                    <div class="container mx-auto px-4 py-2">
                        <div class="flex items-center justify-center space-x-2 text-yellow-800 text-sm">
                            <i class="fas fa-flask"></i>
                            <span><strong>Testnet Mode:</strong> Using Cardano testnet with reduced prices (0.1-0.5 tADA). Get free testnet ADA from the</span>
                            <a href="https://docs.cardano.org/cardano-testnet/tools/faucet" target="_blank" class="underline hover:no-underline">Cardano Faucet</a>
                        </div>
                    </div>
                </div>

                <!-- Navigation -->
                <nav class="bg-white shadow-sm border-b">
                    <div class="container mx-auto px-4">
                        <div class="flex space-x-8">
                            <button id="nav-home" class="nav-btn py-4 px-2 border-b-2 border-transparent hover:border-blue-500 transition-colors ${this.currentView === 'home' ? 'border-blue-500 text-blue-600' : 'text-gray-600'}">
                                <i class="fas fa-home mr-2"></i>Home
                            </button>
                            <button id="nav-chat" class="nav-btn py-4 px-2 border-b-2 border-transparent hover:border-blue-500 transition-colors ${this.currentView === 'chat' ? 'border-blue-500 text-blue-600' : 'text-gray-600'}">
                                <i class="fas fa-comments mr-2"></i>AI Assistant
                            </button>
                            <button id="nav-services" class="nav-btn py-4 px-2 border-b-2 border-transparent hover:border-blue-500 transition-colors ${this.currentView === 'services' ? 'border-blue-500 text-blue-600' : 'text-gray-600'}">
                                <i class="fas fa-cogs mr-2"></i>Services
                            </button>
                        </div>
                    </div>
                </nav>

                <!-- Main Content -->
                <main class="container mx-auto px-4 py-8">
                    <div id="content-container">
                        ${this.renderCurrentView()}
                    </div>
                </main>

                <!-- Footer -->
                <footer class="bg-gray-800 text-white py-8 mt-16">
                    <div class="container mx-auto px-4">
                        <div class="grid md:grid-cols-3 gap-8">
                            <div>
                                <h3 class="text-lg font-semibold mb-4">Cardano Career Navigator</h3>
                                <p class="text-gray-300">Empowering your journey in the Cardano ecosystem with AI-powered career guidance.</p>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold mb-4">Services</h3>
                                <ul class="text-gray-300 space-y-2">
                                    <li>Skills Assessment (0.5 ADA)</li>
                                    <li>Career Roadmap (1.5 ADA)</li>
                                    <li>Catalyst Guidance (3.0 ADA)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold mb-4">Powered By</h3>
                                <div class="flex items-center space-x-4">
                                    <div class="begin-wallet-gradient px-3 py-1 rounded-lg text-sm font-medium">
                                        Begin Wallet
                                    </div>
                                    <div class="bg-blue-600 px-3 py-1 rounded-lg text-sm font-medium">
                                        Cardano
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        `;

        // Initialize components
        this.walletConnection = new WalletConnection(this.walletManager);
        this.walletConnection.render(document.getElementById('wallet-connection-container'));

        this.chatInterface = new ChatInterface(this.walletManager);
        this.serviceCards = new ServiceCards(this.walletManager);
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'home':
                return this.renderHomeView();
            case 'chat':
                return '<div id="chat-interface-container"></div>';
            case 'services':
                return '<div id="service-cards-container"></div>';
            default:
                return this.renderHomeView();
        }
    }

    renderHomeView() {
        return `
            <div class="max-w-4xl mx-auto">
                <!-- Hero Section -->
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">
                        Navigate Your Cardano Career with AI
                    </h2>
                    <p class="text-xl text-gray-600 mb-8">
                        Get personalized career guidance, skill assessments, and roadmaps tailored to the Cardano ecosystem
                    </p>
                    <div class="flex justify-center space-x-4">
                        <button id="start-assessment-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                            <i class="fas fa-chart-line mr-2"></i>Start Assessment
                        </button>
                        <button id="start-chat-btn" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                            <i class="fas fa-comments mr-2"></i>Chat with AI
                        </button>
                    </div>
                </div>

                <!-- Features Grid -->
                <div class="grid md:grid-cols-3 gap-8 mb-12">
                    <div class="bg-white p-6 rounded-xl shadow-lg card-hover">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-brain text-blue-600 text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                        <p class="text-gray-600">Advanced AI analyzes your on-chain activity to understand your skills and experience level.</p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-xl shadow-lg card-hover">
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-map-marked-alt text-green-600 text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Personalized Roadmaps</h3>
                        <p class="text-gray-600">Get custom learning paths with milestones, resources, and opportunities.</p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-xl shadow-lg card-hover">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <i class="fas fa-rocket text-purple-600 text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Catalyst Integration</h3>
                        <p class="text-gray-600">Discover relevant Project Catalyst opportunities and get guidance on proposals.</p>
                    </div>
                </div>

                <!-- Begin Wallet Integration -->
                <div class="bg-gradient-to-r from-red-400 to-teal-400 rounded-xl p-8 text-white mb-12">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-2xl font-bold mb-2">Enhanced with Begin Wallet</h3>
                            <p class="text-lg opacity-90">Track your progress on-chain, earn eSIM rewards, and collect achievement NFTs</p>
                            <ul class="mt-4 space-y-2">
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle mr-2"></i>
                                    On-chain progress tracking
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle mr-2"></i>
                                    eSIM data rewards for milestones
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-check-circle mr-2"></i>
                                    Verifiable achievement NFTs
                                </li>
                            </ul>
                        </div>
                        <div class="hidden md:block">
                            <div class="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <i class="fas fa-wallet text-6xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Troubleshooting Section -->
                <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-12">
                    <h3 class="text-lg font-semibold text-yellow-800 mb-4">
                        <i class="fas fa-question-circle mr-2"></i>Having trouble connecting your wallet?
                    </h3>
                    <div class="grid md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <h4 class="font-medium text-yellow-800 mb-2">Common Solutions:</h4>
                            <ul class="space-y-1 text-yellow-700">
                                <li>• Make sure your wallet extension is installed and enabled</li>
                                <li>• Refresh the page after installing a wallet</li>
                                <li>• Check that your wallet is unlocked</li>
                                <li>• Try using a different browser or incognito mode</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-medium text-yellow-800 mb-2">Supported Wallets:</h4>
                            <ul class="space-y-1 text-yellow-700">
                                <li>• Nami Wallet</li>
                                <li>• Eternl (formerly CCVault)</li>
                                <li>• Begin Wallet (recommended)</li>
                                <li>• Flint, Typhon, Yoroi, GeroWallet</li>
                            </ul>
                        </div>
                    </div>
                    <div class="mt-4 text-center">
                        <button id="test-demo-wallet" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm">
                            <i class="fas fa-flask mr-2"></i>Try Demo Wallet
                        </button>
                    </div>
                </div>

                <!-- Stats Section -->
                <div class="grid md:grid-cols-4 gap-6 text-center">
                    <div class="bg-white p-6 rounded-xl shadow-lg">
                        <div class="text-3xl font-bold text-blue-600 mb-2">500+</div>
                        <div class="text-gray-600">Assessments Completed</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-lg">
                        <div class="text-3xl font-bold text-green-600 mb-2">200+</div>
                        <div class="text-gray-600">Roadmaps Generated</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-lg">
                        <div class="text-3xl font-bold text-purple-600 mb-2">50+</div>
                        <div class="text-gray-600">Catalyst Proposals</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-lg">
                        <div class="text-3xl font-bold text-red-600 mb-2">95%</div>
                        <div class="text-gray-600">User Satisfaction</div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.id === 'nav-home') {
                this.switchView('home');
            } else if (e.target.id === 'nav-chat') {
                this.switchView('chat');
            } else if (e.target.id === 'nav-services') {
                this.switchView('services');
            } else if (e.target.id === 'start-assessment-btn') {
                this.startAssessment();
            } else if (e.target.id === 'start-chat-btn') {
                this.switchView('chat');
            } else if (e.target.id === 'test-demo-wallet') {
                this.connectDemoWallet();
            }
        });

        // Wallet events
        window.addEventListener('wallet-connected', (event) => {
            this.onWalletConnected(event.detail);
        });

        window.addEventListener('wallet-disconnected', () => {
            this.onWalletDisconnected();
        });
    }

    switchView(view) {
        this.currentView = view;
        const contentContainer = document.getElementById('content-container');
        contentContainer.innerHTML = this.renderCurrentView();

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.className = btn.className.replace('border-blue-500 text-blue-600', 'border-transparent text-gray-600');
        });
        
        const activeBtn = document.getElementById(`nav-${view}`);
        if (activeBtn) {
            activeBtn.className = activeBtn.className.replace('border-transparent text-gray-600', 'border-blue-500 text-blue-600');
        }

        // Initialize view-specific components
        if (view === 'chat') {
            this.chatInterface.render(document.getElementById('chat-interface-container'));
        } else if (view === 'services') {
            this.serviceCards.render(document.getElementById('service-cards-container'));
        }
    }

    async startAssessment() {
        if (!this.walletManager.isConnected()) {
            this.showNotification('Please connect your wallet first', 'warning');
            return;
        }

        this.switchView('chat');
        // Auto-start assessment in chat
        setTimeout(() => {
            this.chatInterface.startAssessment();
        }, 500);
    }

    onWalletConnected(walletInfo) {
        this.showNotification(`Connected to ${walletInfo.name}`, 'success');
        
        // Update chat interface state
        if (this.chatInterface) {
            this.chatInterface.updateChatState();
        }
        
        // Show connection success message in chat
        if (this.currentView === 'chat' && this.chatInterface) {
            setTimeout(() => {
                this.chatInterface.addSystemMessage(`🎉 Wallet connected! You can now use all services. Your address: ${this.formatAddress(walletInfo.address)}`);
            }, 1000);
        }
    }

    onWalletDisconnected() {
        this.showNotification('Wallet disconnected', 'info');
        
        // Update chat interface state
        if (this.chatInterface) {
            this.chatInterface.updateChatState();
        }
    }

    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 8)}...${address.slice(-8)}`;
    }

    async connectDemoWallet() {
        try {
            await this.walletManager.connectWallet('demo');
            this.showNotification('Demo wallet connected! You can now test all features.', 'success');
            
            // Dispatch wallet connected event
            window.dispatchEvent(new CustomEvent('wallet-connected', {
                detail: this.walletManager.getWalletInfo()
            }));
            
        } catch (error) {
            this.showNotification('Failed to connect demo wallet', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'warning' ? 'bg-yellow-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white max-w-sm`;
        notification.innerHTML = `
            <div class="flex items-start space-x-2">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' : 
                    type === 'error' ? 'fa-times-circle' : 'fa-info-circle'
                } mt-0.5"></i>
                <span class="text-sm">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}