/**
 * Chat Interface Component for AI Assistant
 */

import { ApiService } from '../services/ApiService.js';

export class ChatInterface {
    constructor(walletManager) {
        this.walletManager = walletManager;
        this.apiService = new ApiService();
        this.messages = [];
        this.isTyping = false;
        this.currentService = null;
    }

    render(container) {
        container.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <!-- Chat Header -->
                    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <i class="fas fa-robot text-xl"></i>
                                </div>
                                <div>
                                    <h2 class="text-xl font-semibold">AI Career Assistant</h2>
                                    <p class="text-blue-100">Your personal Cardano career guide</p>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button id="clear-chat-btn" class="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors">
                                    <i class="fas fa-trash mr-2"></i>Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Chat Messages -->
                    <div id="chat-messages" class="h-96 overflow-y-auto p-6 space-y-4">
                        ${this.renderMessages()}
                    </div>

                    <!-- Typing Indicator -->
                    <div id="typing-indicator" class="px-6 pb-2 hidden">
                        <div class="flex items-center space-x-2 text-gray-500">
                            <div class="typing-indicator">
                                <i class="fas fa-circle text-xs"></i>
                                <i class="fas fa-circle text-xs"></i>
                                <i class="fas fa-circle text-xs"></i>
                            </div>
                            <span class="text-sm">AI is thinking...</span>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="px-6 pb-4">
                        <div class="flex flex-wrap gap-2 mb-4">
                            <button class="quick-action-btn bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm transition-colors" data-action="assessment">
                                <i class="fas fa-chart-line mr-1"></i>Skills Assessment
                            </button>
                            <button class="quick-action-btn bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm transition-colors" data-action="roadmap">
                                <i class="fas fa-map-marked-alt mr-1"></i>Career Roadmap
                            </button>
                            <button class="quick-action-btn bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm transition-colors" data-action="catalyst">
                                <i class="fas fa-rocket mr-1"></i>Catalyst Guidance
                            </button>
                            <button class="quick-action-btn bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 rounded-lg text-sm transition-colors" data-action="help">
                                <i class="fas fa-question-circle mr-1"></i>Help
                            </button>
                        </div>
                    </div>

                    <!-- Chat Input -->
                    <div class="border-t bg-gray-50 p-6">
                        <div class="flex space-x-4">
                            <input 
                                type="text" 
                                id="chat-input" 
                                placeholder="Ask me about your Cardano career..." 
                                class="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled
                            >
                            <button 
                                id="send-btn" 
                                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled
                            >
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="mt-2 text-sm text-gray-500 text-center">
                            ${this.walletManager.isConnected() ? 
                                'Connected - Ready to chat!' : 
                                'Connect your wallet to start chatting'
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupChatEventListeners();
        this.updateChatState();
        
        // Add welcome message if no messages
        if (this.messages.length === 0) {
            this.addWelcomeMessage();
        }
    }

    renderMessages() {
        if (this.messages.length === 0) {
            return '<div class="text-center text-gray-500 py-8">Start a conversation with your AI career assistant!</div>';
        }

        return this.messages.map(message => this.renderMessage(message)).join('');
    }

    renderMessage(message) {
        const isUser = message.sender === 'user';
        const timestamp = new Date(message.timestamp).toLocaleTimeString();

        return `
            <div class="chat-bubble flex ${isUser ? 'justify-end' : 'justify-start'}">
                <div class="max-w-xs lg:max-w-md ${isUser ? 'order-1' : 'order-2'}">
                    <div class="${isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg px-4 py-3">
                        ${message.type === 'service-result' ? this.renderServiceResult(message) : message.content}
                    </div>
                    <div class="text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}">
                        ${timestamp}
                    </div>
                </div>
                <div class="${isUser ? 'order-2 mr-2' : 'order-1 ml-2'} flex-shrink-0">
                    <div class="w-8 h-8 rounded-full ${isUser ? 'bg-blue-600' : 'bg-gray-400'} flex items-center justify-center text-white text-sm">
                        ${isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>'}
                    </div>
                </div>
            </div>
        `;
    }

    renderServiceResult(message) {
        const result = message.data;
        
        if (message.serviceType === 'assessment') {
            return `
                <div class="space-y-3">
                    <h4 class="font-semibold">Skills Assessment Complete!</h4>
                    <div class="bg-white bg-opacity-20 rounded p-3 text-sm">
                        <p><strong>Experience Level:</strong> ${result.profile.experienceLevel}</p>
                        <p><strong>Preferred Path:</strong> ${result.profile.preferredPath}</p>
                        <p><strong>Skills:</strong> ${result.profile.technicalSkills.slice(0, 3).join(', ')}</p>
                    </div>
                    <div class="text-sm">
                        <p class="mb-2"><strong>Next Steps:</strong></p>
                        <ul class="list-disc list-inside space-y-1">
                            ${result.nextSteps.slice(0, 2).map(step => `<li>${step.action}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-colors" onclick="window.careerNavigator.requestRoadmap()">
                        Get Detailed Roadmap (1.5 ADA)
                    </button>
                </div>
            `;
        } else if (message.serviceType === 'roadmap') {
            return `
                <div class="space-y-3">
                    <h4 class="font-semibold">Career Roadmap Generated!</h4>
                    <div class="bg-white bg-opacity-20 rounded p-3 text-sm">
                        <p><strong>Timeline:</strong> ${result.roadmap.timeline}</p>
                        <p><strong>Milestones:</strong> ${result.roadmap.totalMilestones}</p>
                        <p><strong>Opportunities:</strong> ${result.opportunities.totalOpportunities}</p>
                    </div>
                    <div class="text-sm">
                        <p class="mb-2"><strong>First Milestone:</strong></p>
                        <p>${result.roadmap.milestones[0]?.name || 'Start your learning journey'}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button class="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-colors" onclick="window.careerNavigator.viewFullRoadmap()">
                            View Full Roadmap
                        </button>
                        <button class="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-colors" onclick="window.careerNavigator.requestCatalyst()">
                            Catalyst Guidance (3.0 ADA)
                        </button>
                    </div>
                </div>
            `;
        }
        
        return message.content;
    }

    setupChatEventListeners() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const clearBtn = document.getElementById('clear-chat-btn');

        // Send message
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message && !this.isTyping) {
                this.sendMessage(message);
                chatInput.value = '';
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Clear chat
        clearBtn.addEventListener('click', () => {
            this.clearChat();
        });

        // Quick actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            }
        });

        // Wallet connection updates
        window.addEventListener('wallet-connected', () => {
            this.updateChatState();
        });

        window.addEventListener('wallet-disconnected', () => {
            this.updateChatState();
        });
    }

    updateChatState() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const isConnected = this.walletManager.isConnected();

        if (chatInput && sendBtn) {
            chatInput.disabled = !isConnected;
            sendBtn.disabled = !isConnected;
            
            if (isConnected) {
                chatInput.placeholder = "Ask me about your Cardano career...";
            } else {
                chatInput.placeholder = "Connect your wallet to start chatting...";
            }
        }
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            id: Date.now(),
            sender: 'assistant',
            content: `
                <div class="space-y-3">
                    <h4 class="font-semibold">Welcome to Cardano Career Navigator! 🚀</h4>
                    <p>I'm your AI career assistant, here to help you navigate opportunities in the Cardano ecosystem.</p>
                    <div class="text-sm">
                        <p class="mb-2"><strong>I can help you with:</strong></p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Skills assessment based on your on-chain activity</li>
                            <li>Personalized career roadmaps</li>
                            <li>Project Catalyst guidance</li>
                            <li>Begin Wallet integration tips</li>
                        </ul>
                    </div>
                    <p class="text-sm">Connect your wallet and let's get started!</p>
                </div>
            `,
            timestamp: Date.now(),
            type: 'welcome'
        };

        this.messages.push(welcomeMessage);
        this.updateChatDisplay();
    }

    async sendMessage(content) {
        // Add user message
        const userMessage = {
            id: Date.now(),
            sender: 'user',
            content: content,
            timestamp: Date.now()
        };

        this.messages.push(userMessage);
        this.updateChatDisplay();
        this.showTyping();

        try {
            // Process message and get response
            const response = await this.processMessage(content);
            
            this.hideTyping();
            
            // Add assistant response
            const assistantMessage = {
                id: Date.now() + 1,
                sender: 'assistant',
                content: response.content,
                timestamp: Date.now(),
                type: response.type,
                serviceType: response.serviceType,
                data: response.data
            };

            this.messages.push(assistantMessage);
            this.updateChatDisplay();

        } catch (error) {
            this.hideTyping();
            this.addErrorMessage('Sorry, I encountered an error. Please try again.');
            console.error('Chat error:', error);
        }
    }

    async processMessage(message) {
        // Simple intent detection
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('assessment') || lowerMessage.includes('skill')) {
            return await this.handleAssessmentRequest();
        } else if (lowerMessage.includes('roadmap') || lowerMessage.includes('path')) {
            return await this.handleRoadmapRequest();
        } else if (lowerMessage.includes('catalyst')) {
            return await this.handleCatalystRequest();
        } else if (lowerMessage.includes('help')) {
            return this.getHelpResponse();
        } else {
            return this.getGeneralResponse(message);
        }
    }

    async handleAssessmentRequest() {
        if (!this.walletManager.isConnected()) {
            return {
                content: 'Please connect your wallet first to get a skills assessment.',
                type: 'error'
            };
        }

        try {
            const walletAddress = await this.walletManager.getAddress();
            const result = await this.apiService.requestAssessment(walletAddress);
            
            return {
                content: 'Assessment completed successfully!',
                type: 'service-result',
                serviceType: 'assessment',
                data: result
            };
        } catch (error) {
            return {
                content: 'Failed to complete assessment. Please ensure you have 0.5 ADA and try again.',
                type: 'error'
            };
        }
    }

    async handleRoadmapRequest() {
        if (!this.walletManager.isConnected()) {
            return {
                content: 'Please connect your wallet first to get a career roadmap.',
                type: 'error'
            };
        }

        // Check if user has completed assessment
        const hasAssessment = this.messages.some(msg => 
            msg.type === 'service-result' && msg.serviceType === 'assessment'
        );

        if (!hasAssessment) {
            return {
                content: 'I recommend completing a skills assessment first (0.5 ADA) before getting your roadmap. This helps me provide more accurate guidance.',
                type: 'suggestion'
            };
        }

        try {
            const walletAddress = await this.walletManager.getAddress();
            const timeline = '6-months'; // Default timeline
            const result = await this.apiService.requestRoadmap(walletAddress, timeline);
            
            return {
                content: 'Roadmap generated successfully!',
                type: 'service-result',
                serviceType: 'roadmap',
                data: result
            };
        } catch (error) {
            return {
                content: 'Failed to generate roadmap. Please ensure you have 1.5 ADA and try again.',
                type: 'error'
            };
        }
    }

    async handleCatalystRequest() {
        return {
            content: `
                <div class="space-y-3">
                    <h4 class="font-semibold">Project Catalyst Guidance</h4>
                    <p>I can help you with Project Catalyst proposals and participation!</p>
                    <div class="text-sm">
                        <p class="mb-2"><strong>Services include:</strong></p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Proposal writing guidance</li>
                            <li>Budget planning assistance</li>
                            <li>Community engagement strategies</li>
                            <li>Voting and governance tips</li>
                        </ul>
                    </div>
                    <p class="text-sm">This service costs 3.0 ADA and requires intermediate+ experience level.</p>
                    <button class="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-colors mt-2" onclick="window.careerNavigator.requestCatalyst()">
                        Get Catalyst Guidance (3.0 ADA)
                    </button>
                </div>
            `,
            type: 'service-info'
        };
    }

    getHelpResponse() {
        return {
            content: `
                <div class="space-y-3">
                    <h4 class="font-semibold">How I Can Help You</h4>
                    <div class="text-sm space-y-2">
                        <div class="bg-white bg-opacity-20 rounded p-2">
                            <strong>Skills Assessment (0.5 ADA)</strong><br>
                            Analyze your on-chain activity to determine your experience level and skills
                        </div>
                        <div class="bg-white bg-opacity-20 rounded p-2">
                            <strong>Career Roadmap (1.5 ADA)</strong><br>
                            Get a personalized learning path with milestones and opportunities
                        </div>
                        <div class="bg-white bg-opacity-20 rounded p-2">
                            <strong>Catalyst Guidance (3.0 ADA)</strong><br>
                            Specialized help for Project Catalyst participation
                        </div>
                    </div>
                    <p class="text-sm">Just ask me about any of these services or use the quick action buttons!</p>
                </div>
            `,
            type: 'help'
        };
    }

    getGeneralResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Context-aware responses
        if (lowerMessage.includes('begin wallet') || lowerMessage.includes('beginwallet')) {
            return {
                content: `
                    <div class="space-y-3">
                        <h4 class="font-semibold">Begin Wallet Integration 🚀</h4>
                        <p>Begin Wallet offers unique features perfect for your Cardano career journey!</p>
                        <div class="text-sm">
                            <p class="mb-2"><strong>Special features:</strong></p>
                            <ul class="list-disc list-inside space-y-1">
                                <li>📱 eSIM data rewards for completing milestones</li>
                                <li>🏆 On-chain progress tracking with metadata</li>
                                <li>🎯 Achievement NFTs for major accomplishments</li>
                                <li>🌍 Global connectivity for remote learning</li>
                            </ul>
                        </div>
                        <p class="text-sm">Would you like to start with a skills assessment to see how Begin Wallet can enhance your learning?</p>
                    </div>
                `,
                type: 'begin-wallet-info'
            };
        }
        
        if (lowerMessage.includes('testnet') || lowerMessage.includes('test')) {
            return {
                content: `
                    <div class="space-y-3">
                        <h4 class="font-semibold">Testnet Mode Active 🧪</h4>
                        <p>You're using the Cardano testnet version with special features:</p>
                        <div class="bg-blue-50 rounded p-3 text-sm">
                            <p><strong>Testnet Benefits:</strong></p>
                            <ul class="list-disc list-inside space-y-1 mt-2">
                                <li>Lower prices: Assessment (0.1 tADA), Roadmap (0.3 tADA), Catalyst (0.5 tADA)</li>
                                <li>Free testnet ADA from faucets</li>
                                <li>Safe environment for learning</li>
                                <li>All features work exactly like mainnet</li>
                            </ul>
                        </div>
                        <p class="text-sm">Ready to explore your Cardano career path? Let's start with an assessment!</p>
                    </div>
                `,
                type: 'testnet-info'
            };
        }
        
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('ada')) {
            return {
                content: `
                    <div class="space-y-3">
                        <h4 class="font-semibold">Testnet Pricing 💰</h4>
                        <p>Special testnet prices for learning and testing:</p>
                        <div class="grid grid-cols-1 gap-2 text-sm">
                            <div class="bg-blue-50 rounded p-2">
                                <strong>Skills Assessment:</strong> 0.1 tADA<br>
                                <span class="text-gray-600">Analyze your on-chain activity and skills</span>
                            </div>
                            <div class="bg-green-50 rounded p-2">
                                <strong>Career Roadmap:</strong> 0.3 tADA<br>
                                <span class="text-gray-600">Personalized learning path with milestones</span>
                            </div>
                            <div class="bg-purple-50 rounded p-2">
                                <strong>Catalyst Guidance:</strong> 0.5 tADA<br>
                                <span class="text-gray-600">Expert help with Project Catalyst</span>
                            </div>
                        </div>
                        <p class="text-sm">💡 Get free testnet ADA from the <a href="https://docs.cardano.org/cardano-testnet/tools/faucet" target="_blank" class="text-blue-600 underline">Cardano Faucet</a></p>
                    </div>
                `,
                type: 'pricing-info'
            };
        }
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            const greetings = [
                `
                    <div class="space-y-3">
                        <h4 class="font-semibold">Hello! Welcome to Cardano Career Navigator! 👋</h4>
                        <p>I'm your AI career assistant, specialized in the Cardano ecosystem. I can help you:</p>
                        <div class="text-sm">
                            <ul class="list-disc list-inside space-y-1">
                                <li>🔍 Assess your current skills and experience</li>
                                <li>🗺️ Create personalized learning roadmaps</li>
                                <li>🚀 Guide you through Project Catalyst</li>
                                <li>📱 Integrate with Begin Wallet for rewards</li>
                            </ul>
                        </div>
                        <p class="text-sm">What would you like to explore first?</p>
                    </div>
                `,
                `
                    <div class="space-y-3">
                        <h4 class="font-semibold">Hey there! 🌟</h4>
                        <p>Ready to accelerate your Cardano career? I'm here to provide personalized guidance based on your on-chain activity.</p>
                        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded p-3 text-sm">
                            <p><strong>🧪 Testnet Mode:</strong> Perfect for learning with low-cost services!</p>
                            <p><strong>📱 Begin Wallet:</strong> Earn eSIM rewards as you learn!</p>
                            <p><strong>🎯 AI-Powered:</strong> Personalized recommendations just for you!</p>
                        </div>
                        <p class="text-sm">Shall we start with a quick skills assessment?</p>
                    </div>
                `
            ];
            return {
                content: greetings[Math.floor(Math.random() * greetings.length)],
                type: 'greeting'
            };
        }
        
        // Default responses with more personality
        const responses = [
            `
                <div class="space-y-3">
                    <p>That's an interesting question! 🤔</p>
                    <p>I specialize in Cardano career guidance and can analyze your on-chain activity to provide personalized recommendations.</p>
                    <div class="bg-blue-50 rounded p-3 text-sm">
                        <p><strong>💡 Quick tip:</strong> Starting with a skills assessment (just 0.1 tADA on testnet) gives me the context I need to provide much better guidance!</p>
                    </div>
                    <p class="text-sm">Would you like to begin with an assessment?</p>
                </div>
            `,
            `
                <div class="space-y-3">
                    <p>Great question! I'm here to help you navigate the Cardano ecosystem. 🧭</p>
                    <p>Whether you're interested in development, design, community building, or research, I can create a personalized path for you.</p>
                    <div class="text-sm">
                        <p class="mb-2"><strong>What I can help with:</strong></p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Analyze your transaction history for skills assessment</li>
                            <li>Create learning roadmaps with Begin Wallet integration</li>
                            <li>Find relevant Catalyst opportunities and bounties</li>
                            <li>Provide step-by-step career guidance</li>
                        </ul>
                    </div>
                    <p class="text-sm">What specific area interests you most?</p>
                </div>
            `,
            `
                <div class="space-y-3">
                    <p>I can provide personalized guidance based on your on-chain activity! 📊</p>
                    <p>By analyzing your Cardano transactions, I can understand your experience level, interests, and recommend the perfect career path.</p>
                    <div class="bg-green-50 rounded p-3 text-sm">
                        <p><strong>🎯 Personalized for you:</strong> Every recommendation is based on your actual blockchain activity, not generic advice!</p>
                    </div>
                    <p class="text-sm">Ready to discover your Cardano career potential?</p>
                </div>
            `
        ];

        return {
            content: responses[Math.floor(Math.random() * responses.length)],
            type: 'general'
        };
    }

    handleQuickAction(action) {
        const actions = {
            'assessment': 'I want a skills assessment',
            'roadmap': 'I want a career roadmap',
            'catalyst': 'Tell me about Catalyst guidance',
            'help': 'I need help'
        };

        if (actions[action]) {
            this.sendMessage(actions[action]);
        }
    }

    async startAssessment() {
        this.sendMessage('I want a skills assessment');
    }

    showTyping() {
        this.isTyping = true;
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.remove('hidden');
        }
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    addErrorMessage(content) {
        const errorMessage = {
            id: Date.now(),
            sender: 'assistant',
            content: `<div class="text-red-600"><i class="fas fa-exclamation-triangle mr-2"></i>${content}</div>`,
            timestamp: Date.now(),
            type: 'error'
        };

        this.messages.push(errorMessage);
        this.updateChatDisplay();
    }

    updateChatDisplay() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = this.renderMessages();
            this.scrollToBottom();
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    clearChat() {
        this.messages = [];
        this.addWelcomeMessage();
    }

    addSystemMessage(content) {
        const systemMessage = {
            id: Date.now(),
            sender: 'assistant',
            content: `<div class="text-green-600"><i class="fas fa-info-circle mr-2"></i>${content}</div>`,
            timestamp: Date.now(),
            type: 'system'
        };

        this.messages.push(systemMessage);
        this.updateChatDisplay();
    }
}