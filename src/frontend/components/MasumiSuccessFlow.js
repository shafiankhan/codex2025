/**
 * Masumi Success Flow Component
 * Shows success message and next steps after wallet connection
 */

import { masumiService } from '../services/MasumiService.js';

export class MasumiSuccessFlow {
    constructor(walletManager) {
        this.walletManager = walletManager;
        this.currentPayment = null;
        this.jobId = null;
    }

    // Show wallet connection success
    showWalletConnectionSuccess(walletInfo) {
        const container = document.getElementById('masumi-success-container') || this.createContainer();
        
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check-circle text-3xl text-green-600"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Wallet Connected Successfully! 🎉</h2>
                    <p class="text-gray-600">Your ${walletInfo.name} is now connected to Masumi Network</p>
                </div>

                <div class="bg-blue-50 rounded-lg p-4 mb-6">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-wallet text-blue-600"></i>
                        <div>
                            <p class="font-semibold text-blue-900">Wallet Information</p>
                            <p class="text-blue-700 text-sm">Address: ${this.formatAddress(walletInfo.address)}</p>
                            <p class="text-blue-700 text-sm">Balance: ${walletInfo.balance.ada} ADA</p>
                            <p class="text-blue-700 text-sm">Network: ${walletInfo.networkId === 0 ? 'Testnet' : 'Mainnet'}</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-4 mb-6">
                    <h3 class="text-lg font-semibold text-gray-900">🚀 What's Next?</h3>
                    
                    <div class="grid gap-4">
                        <div class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onclick="window.masumiFlow.selectService('assessment')">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-chart-line text-purple-600"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Skills Assessment</h4>
                                        <p class="text-gray-600 text-sm">Analyze your Cardano experience</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-purple-600">0.5 ADA</p>
                                    <p class="text-gray-500 text-xs">2-3 min</p>
                                </div>
                            </div>
                        </div>

                        <div class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onclick="window.masumiFlow.selectService('roadmap')">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-map text-blue-600"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Career Roadmap</h4>
                                        <p class="text-gray-600 text-sm">Get personalized learning path</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-blue-600">1.5 ADA</p>
                                    <p class="text-gray-500 text-xs">3-5 min</p>
                                </div>
                            </div>
                        </div>

                        <div class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onclick="window.masumiFlow.selectService('catalyst')">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <i class="fas fa-rocket text-green-600"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">Catalyst Guidance</h4>
                                        <p class="text-gray-600 text-sm">Project proposal assistance</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-green-600">3.0 ADA</p>
                                    <p class="text-gray-500 text-xs">5-10 min</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-yellow-50 rounded-lg p-4 mb-6">
                    <div class="flex items-start space-x-3">
                        <i class="fas fa-info-circle text-yellow-600 mt-1"></i>
                        <div>
                            <p class="font-semibold text-yellow-900">Testnet Mode Active</p>
                            <p class="text-yellow-800 text-sm">You're using Cardano testnet. Payments are processed through Masumi Network for demonstration purposes.</p>
                        </div>
                    </div>
                </div>

                <div class="flex space-x-4">
                    <button onclick="window.masumiFlow.hide()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        Continue Browsing
                    </button>
                    <button onclick="window.masumiFlow.selectService('assessment')" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Start with Assessment
                    </button>
                </div>
            </div>
        `;

        container.classList.remove('hidden');
        
        // Make this available globally for onclick handlers
        window.masumiFlow = this;
    }

    // Show payment processing
    async selectService(serviceType) {
        const container = document.getElementById('masumi-success-container');
        
        // Show processing state
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-credit-card text-3xl text-blue-600"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h2>
                    <p class="text-gray-600">Connecting to Masumi Network</p>
                </div>

                <div class="flex items-center justify-center space-x-2 mb-6">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span class="text-gray-600">Processing ${serviceType} payment...</span>
                </div>
            </div>
        `;

        try {
            // Process payment through Masumi
            const walletInfo = this.walletManager.getWalletInfo();
            const paymentResult = await masumiService.processTestnetPayment(
                walletInfo.address, 
                serviceType, 
                this.walletManager
            );

            // Start job processing
            const jobResult = await masumiService.startJobProcessing(paymentResult);
            this.jobId = jobResult.jobId;

            // Show success
            this.showPaymentSuccess(paymentResult);

        } catch (error) {
            this.showPaymentError(error);
        }
    }

    // Show payment success
    showPaymentSuccess(paymentResult) {
        const container = document.getElementById('masumi-success-container');
        const successData = masumiService.generateSuccessMessage(paymentResult);
        
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check-circle text-3xl text-green-600"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${successData.title}</h2>
                    <p class="text-gray-600">${successData.subtitle}</p>
                </div>

                <div class="bg-green-50 rounded-lg p-4 mb-6">
                    <h3 class="font-semibold text-green-900 mb-2">Transaction Details</h3>
                    ${successData.details.map(detail => `
                        <p class="text-green-800 text-sm">${detail}</p>
                    `).join('')}
                </div>

                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">${paymentResult.nextSteps.title}</h3>
                    
                    <div class="space-y-3">
                        ${paymentResult.nextSteps.steps.map(step => `
                            <div class="flex items-center space-x-3 p-3 rounded-lg ${this.getStepBgColor(step.status)}">
                                <span class="text-lg">${step.icon}</span>
                                <span class="text-gray-700">${step.text}</span>
                                ${step.status === 'processing' ? '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 ml-auto"></div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${paymentResult.nextSteps.recommendations.length > 0 ? `
                    <div class="bg-blue-50 rounded-lg p-4 mb-6">
                        <h4 class="font-semibold text-blue-900 mb-2">Recommended Next Steps</h4>
                        ${paymentResult.nextSteps.recommendations.map(rec => `
                            <div class="flex items-center justify-between p-2">
                                <div>
                                    <p class="font-medium text-blue-900">${rec.title}</p>
                                    <p class="text-blue-700 text-sm">${rec.description}</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-blue-600">${rec.price}</p>
                                    ${rec.service !== 'complete' ? `<button onclick="window.masumiFlow.selectService('${rec.service}')" class="text-blue-600 text-sm hover:underline">Get Started</button>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="flex space-x-4">
                    <button onclick="window.masumiFlow.checkJobStatus()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        <i class="fas fa-sync mr-2"></i>Check Status
                    </button>
                    <button onclick="window.masumiFlow.hide()" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Continue
                    </button>
                </div>
            </div>
        `;
    }

    // Show payment error
    showPaymentError(error) {
        const container = document.getElementById('masumi-success-container');
        const errorData = masumiService.formatErrorMessage(error);
        
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-exclamation-triangle text-3xl text-red-600"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${errorData.title}</h2>
                    <p class="text-gray-600">${errorData.subtitle}</p>
                </div>

                <div class="bg-red-50 rounded-lg p-4 mb-6">
                    <h3 class="font-semibold text-red-900 mb-2">Troubleshooting Steps</h3>
                    ${errorData.details.map(detail => `
                        <p class="text-red-800 text-sm">• ${detail}</p>
                    `).join('')}
                </div>

                <div class="flex space-x-4">
                    <button onclick="window.masumiFlow.hide()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button onclick="window.masumiFlow.showWalletConnectionSuccess(window.masumiFlow.walletManager.getWalletInfo())" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }

    // Check job status
    async checkJobStatus() {
        if (!this.jobId) return;

        try {
            const status = await masumiService.checkJobStatus(this.jobId);
            
            // Update UI with status
            const statusElement = document.querySelector('.job-status');
            if (statusElement) {
                statusElement.textContent = `Status: ${status.status}`;
            }
            
            console.log('Job status:', status);
        } catch (error) {
            console.error('Failed to check job status:', error);
        }
    }

    // Helper methods
    createContainer() {
        const container = document.createElement('div');
        container.id = 'masumi-success-container';
        container.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        document.body.appendChild(container);
        return container;
    }

    formatAddress(address) {
        if (!address) return 'Unknown';
        return address.length > 20 ? `${address.slice(0, 10)}...${address.slice(-10)}` : address;
    }

    getStepBgColor(status) {
        switch (status) {
            case 'processing': return 'bg-blue-50';
            case 'completed': return 'bg-green-50';
            case 'pending': return 'bg-gray-50';
            case 'info': return 'bg-yellow-50';
            default: return 'bg-gray-50';
        }
    }

    hide() {
        const container = document.getElementById('masumi-success-container');
        if (container) {
            container.classList.add('hidden');
        }
    }

    show() {
        const container = document.getElementById('masumi-success-container');
        if (container) {
            container.classList.remove('hidden');
        }
    }
}