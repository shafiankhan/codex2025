/**
 * Service Cards Component - Display available services
 */

import { ApiService } from '../services/ApiService.js';

export class ServiceCards {
    constructor(walletManager) {
        this.walletManager = walletManager;
        this.apiService = new ApiService();
    }

    render(container) {
        container.innerHTML = `
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
                    <p class="text-xl text-gray-600">Professional AI-powered career guidance for the Cardano ecosystem</p>
                </div>

                <div class="grid md:grid-cols-3 gap-8 mb-12">
                    <!-- Skills Assessment -->
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-xl font-semibold">Skills Assessment</h3>
                                    <p class="text-blue-100 mt-1">Analyze your on-chain activity</p>
                                </div>
                                <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-chart-line text-xl"></i>
                                </div>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="mb-4">
                                <div class="text-3xl font-bold text-blue-600 mb-2">0.1 tADA</div>
                                <div class="text-gray-500">Testnet pricing</div>
                            </div>
                            <ul class="space-y-3 mb-6">
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Transaction history analysis
                                </li>
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Experience level determination
                                </li>
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Skills and interests mapping
                                </li>
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Begin Wallet integration tips
                                </li>
                            </ul>
                            <button class="service-btn w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors" data-service="assessment">
                                Start Assessment
                            </button>
                        </div>
                    </div>

                    <!-- Career Roadmap -->
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                        <div class="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-xl font-semibold">Career Roadmap</h3>
                                    <p class="text-green-100 mt-1">Personalized learning path</p>
                                </div>
                                <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-map-marked-alt text-xl"></i>
                                </div>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="mb-4">
                                <div class="text-3xl font-bold text-green-600 mb-2">0.3 tADA</div>
                                <div class="text-gray-500">Testnet pricing</div>
                            </div>
                            <ul class="space-y-3 mb-6">
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Customized learning milestones
                                </li>
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Resource recommendations
                                </li>
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Catalyst opportunities
                                </li>
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Progress tracking setup
                                </li>
                            </ul>
                            <button class="service-btn w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors" data-service="roadmap">
                                Generate Roadmap
                            </button>
                        </div>
                    </div>

                    <!-- Catalyst Guidance -->
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                        <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-xl font-semibold">Catalyst Guidance</h3>
                                    <p class="text-purple-100 mt-1">Project Catalyst expertise</p>
                                </div>
                                <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-rocket text-xl"></i>
                                </div>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="mb-4">
                                <div class="text-3xl font-bold text-purple-600 mb-2">0.5 tADA</div>
                                <div class="text-gray-500">Testnet pricing</div>
                            </div>
                            <ul class="space-y-3 mb-6">
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Proposal writing guidance
                                </li>
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Budget planning assistance
                                </li>
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Community engagement tips
                                </li>
                                <li class="flex items-center text-gray-700">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    Voting strategies
                                </li>
                            </ul>
                            <button class="service-btn w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors" data-service="catalyst">
                                Get Guidance
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Service Flow -->
                <div class="bg-white rounded-xl shadow-lg p-8 mb-12">
                    <h3 class="text-2xl font-bold text-center mb-8">How It Works</h3>
                    <div class="grid md:grid-cols-4 gap-6">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-wallet text-blue-600 text-2xl"></i>
                            </div>
                            <h4 class="font-semibold mb-2">1. Connect Wallet</h4>
                            <p class="text-gray-600 text-sm">Connect your Cardano wallet to get started</p>
                        </div>
                        <div class="text-center">
                            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-cogs text-green-600 text-2xl"></i>
                            </div>
                            <h4 class="font-semibold mb-2">2. Choose Service</h4>
                            <p class="text-gray-600 text-sm">Select the service that fits your needs</p>
                        </div>
                        <div class="text-center">
                            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-credit-card text-purple-600 text-2xl"></i>
                            </div>
                            <h4 class="font-semibold mb-2">3. Make Payment</h4>
                            <p class="text-gray-600 text-sm">Pay with ADA directly from your wallet</p>
                        </div>
                        <div class="text-center">
                            <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-magic text-yellow-600 text-2xl"></i>
                            </div>
                            <h4 class="font-semibold mb-2">4. Get Results</h4>
                            <p class="text-gray-600 text-sm">Receive your personalized AI-generated guidance</p>
                        </div>
                    </div>
                </div>

                <!-- Timeline Options (for roadmap) -->
                <div id="timeline-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
                    <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 class="text-xl font-semibold mb-6">Choose Your Timeline</h3>
                        <div class="space-y-3">
                            <button class="timeline-option w-full p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left" data-timeline="3-months">
                                <div class="font-semibold">3 Months</div>
                                <div class="text-sm text-gray-600">Intensive learning path</div>
                            </button>
                            <button class="timeline-option w-full p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left" data-timeline="6-months">
                                <div class="font-semibold">6 Months</div>
                                <div class="text-sm text-gray-600">Balanced approach (recommended)</div>
                            </button>
                            <button class="timeline-option w-full p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left" data-timeline="12-months">
                                <div class="font-semibold">12 Months</div>
                                <div class="text-sm text-gray-600">Comprehensive deep dive</div>
                            </button>
                        </div>
                        <div class="mt-6 flex justify-end space-x-3">
                            <button id="cancel-timeline" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                        </div>
                    </div>
                </div>

                <!-- Payment Modal -->
                <div id="payment-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
                    <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 class="text-xl font-semibold mb-6">Confirm Payment</h3>
                        <div id="payment-details" class="mb-6">
                            <!-- Payment details will be inserted here -->
                        </div>
                        <div class="flex justify-end space-x-3">
                            <button id="cancel-payment" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                            <button id="confirm-payment" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                                <span id="payment-btn-text">Confirm Payment</span>
                                <i id="payment-spinner" class="fas fa-spinner fa-spin ml-2 hidden"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupServiceEventListeners();
    }

    setupServiceEventListeners() {
        // Service buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('service-btn')) {
                const service = e.target.dataset.service;
                this.handleServiceRequest(service);
            }
        });

        // Timeline selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('timeline-option')) {
                const timeline = e.target.dataset.timeline;
                this.handleRoadmapRequest(timeline);
                this.hideTimelineModal();
            }
        });

        // Modal controls
        document.getElementById('cancel-timeline')?.addEventListener('click', () => {
            this.hideTimelineModal();
        });

        document.getElementById('cancel-payment')?.addEventListener('click', () => {
            this.hidePaymentModal();
        });

        document.getElementById('confirm-payment')?.addEventListener('click', () => {
            this.processPayment();
        });
    }

    async handleServiceRequest(service) {
        if (!this.walletManager.isConnected()) {
            this.showError('Please connect your wallet first');
            return;
        }

        switch (service) {
            case 'assessment':
                await this.handleAssessmentRequest();
                break;
            case 'roadmap':
                this.showTimelineModal();
                break;
            case 'catalyst':
                await this.handleCatalystRequest();
                break;
        }
    }

    async handleAssessmentRequest() {
        try {
            const walletAddress = await this.walletManager.getAddress();
            this.showPaymentModal('assessment', 0.5, 'Skills Assessment');
            this.currentRequest = { type: 'assessment', address: walletAddress };
        } catch (error) {
            this.showError('Failed to get wallet address');
        }
    }

    async handleRoadmapRequest(timeline) {
        try {
            const walletAddress = await this.walletManager.getAddress();
            this.showPaymentModal('roadmap', 1.5, `Career Roadmap (${timeline})`);
            this.currentRequest = { type: 'roadmap', address: walletAddress, timeline };
        } catch (error) {
            this.showError('Failed to get wallet address');
        }
    }

    async handleCatalystRequest() {
        try {
            const walletAddress = await this.walletManager.getAddress();
            this.showPaymentModal('catalyst', 3.0, 'Catalyst Guidance');
            this.currentRequest = { type: 'catalyst', address: walletAddress };
        } catch (error) {
            this.showError('Failed to get wallet address');
        }
    }

    showTimelineModal() {
        const modal = document.getElementById('timeline-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideTimelineModal() {
        const modal = document.getElementById('timeline-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showPaymentModal(service, amount, description) {
        const modal = document.getElementById('payment-modal');
        const details = document.getElementById('payment-details');
        
        if (modal && details) {
            details.innerHTML = `
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-medium">Service:</span>
                        <span>${description}</span>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-medium">Amount:</span>
                        <span class="text-xl font-bold text-blue-600">${amount} ADA</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-medium">Wallet:</span>
                        <span class="text-sm text-gray-600">${this.formatAddress(this.walletManager.getWalletInfo()?.address)}</span>
                    </div>
                </div>
                <div class="mt-4 text-sm text-gray-600">
                    <p>Payment will be processed through your connected wallet. You'll receive your results immediately after confirmation.</p>
                </div>
            `;
            modal.classList.remove('hidden');
        }
    }

    hidePaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    async processPayment() {
        const paymentBtn = document.getElementById('confirm-payment');
        const btnText = document.getElementById('payment-btn-text');
        const spinner = document.getElementById('payment-spinner');

        if (!this.currentRequest) return;

        try {
            // Show loading state
            paymentBtn.disabled = true;
            btnText.textContent = 'Processing...';
            spinner.classList.remove('hidden');

            // Process payment and service request
            let result;
            switch (this.currentRequest.type) {
                case 'assessment':
                    result = await this.apiService.requestAssessment(this.currentRequest.address);
                    break;
                case 'roadmap':
                    result = await this.apiService.requestRoadmap(this.currentRequest.address, this.currentRequest.timeline);
                    break;
                case 'catalyst':
                    result = await this.apiService.requestCatalyst(this.currentRequest.address);
                    break;
            }

            this.hidePaymentModal();
            this.showSuccessModal(this.currentRequest.type, result);

        } catch (error) {
            console.error('Payment failed:', error);
            this.showError('Payment failed. Please try again.');
        } finally {
            // Reset button state
            paymentBtn.disabled = false;
            btnText.textContent = 'Confirm Payment';
            spinner.classList.add('hidden');
        }
    }

    showSuccessModal(serviceType, result) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check text-green-600 text-2xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-green-600">Success!</h3>
                    <p class="text-gray-600">Your ${serviceType} has been completed</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    ${this.formatServiceResult(serviceType, result)}
                </div>
                <div class="flex justify-center space-x-3">
                    <button class="close-success-modal bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                        Close
                    </button>
                    <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg" onclick="window.careerNavigator.switchView('chat')">
                        Continue in Chat
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close-success-modal')) {
                modal.remove();
            }
        });
    }

    formatServiceResult(serviceType, result) {
        switch (serviceType) {
            case 'assessment':
                return `
                    <h4 class="font-semibold mb-3">Your Skills Assessment</h4>
                    <div class="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Experience Level:</strong><br>
                            <span class="text-blue-600">${result.profile.experienceLevel}</span>
                        </div>
                        <div>
                            <strong>Preferred Path:</strong><br>
                            <span class="text-green-600">${result.profile.preferredPath}</span>
                        </div>
                        <div class="md:col-span-2">
                            <strong>Top Skills:</strong><br>
                            <span class="text-purple-600">${result.profile.technicalSkills.slice(0, 3).join(', ')}</span>
                        </div>
                    </div>
                `;
            case 'roadmap':
                return `
                    <h4 class="font-semibold mb-3">Your Career Roadmap</h4>
                    <div class="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Timeline:</strong><br>
                            <span class="text-blue-600">${result.roadmap.timeline}</span>
                        </div>
                        <div>
                            <strong>Milestones:</strong><br>
                            <span class="text-green-600">${result.roadmap.totalMilestones}</span>
                        </div>
                        <div>
                            <strong>Opportunities:</strong><br>
                            <span class="text-purple-600">${result.opportunities.totalOpportunities}</span>
                        </div>
                        <div>
                            <strong>Next Step:</strong><br>
                            <span class="text-orange-600">${result.nextSteps[0]?.title || 'Start learning'}</span>
                        </div>
                    </div>
                `;
            case 'catalyst':
                return `
                    <h4 class="font-semibold mb-3">Catalyst Guidance Ready</h4>
                    <p class="text-sm text-gray-600">Your personalized Catalyst guidance has been prepared. Continue in the chat to explore your options and get detailed advice on proposal creation and community engagement.</p>
                `;
            default:
                return '<p>Service completed successfully!</p>';
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