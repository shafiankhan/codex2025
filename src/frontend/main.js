/**
 * Cardano Career Navigator - Modern dApp Frontend
 */

import { CareerNavigatorDApp } from './components/CareerNavigatorDApp.js';

// Initialize the dApp when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new CareerNavigatorDApp();
    app.init();
});

// Handle wallet connection events
window.addEventListener('cardano-wallet-connected', (event) => {
    console.log('Wallet connected:', event.detail);
});

window.addEventListener('cardano-wallet-disconnected', (event) => {
    console.log('Wallet disconnected:', event.detail);
});