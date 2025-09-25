/**
 * Main entry point for the Cardano Career Navigator dApp
 */

import { CareerNavigatorDApp } from '../src/frontend/components/CareerNavigatorDApp.js';

// Make the app globally accessible for demo purposes
window.careerNavigator = null;

// Initialize the dApp when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Initializing Cardano Career Navigator dApp...');
        
        const app = new CareerNavigatorDApp();
        await app.init();
        
        // Make app globally accessible
        window.careerNavigator = app;
        
        console.log('✅ dApp initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize dApp:', error);
        
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed inset-0 bg-red-50 flex items-center justify-center z-50';
        errorDiv.innerHTML = `
            <div class="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                </div>
                <h2 class="text-xl font-bold text-red-600 mb-2">Initialization Failed</h2>
                <p class="text-gray-600 mb-4">Failed to initialize the dApp. Please refresh the page and try again.</p>
                <button onclick="window.location.reload()" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">
                    Refresh Page
                </button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
});

// Handle wallet connection events
window.addEventListener('cardano-wallet-connected', (event) => {
    console.log('🔗 Wallet connected:', event.detail);
});

window.addEventListener('cardano-wallet-disconnected', (event) => {
    console.log('🔌 Wallet disconnected:', event.detail);
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('🚨 Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
});