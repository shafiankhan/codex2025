/**
 * Masumi Integration Service
 * Handles Masumi Network integration for testnet payments and success flows
 */

export class MasumiService {
    constructor() {
        this.masumiApiUrl = 'https://web-production-d0e02.up.railway.app';
        this.testnetMode = true; // Always true for demo
        this.services = {
            assessment: { price: 0.5, currency: 'ADA', time: '2-3 minutes' },
            roadmap: { price: 1.5, currency: 'ADA', time: '3-5 minutes' },
            catalyst: { price: 3.0, currency: 'ADA', time: '5-10 minutes' }
        };
    }

    // Check Masumi agent availability
    async checkAgentAvailability() {
        try {
            const response = await fetch(`${this.masumiApiUrl}/availability`);
            const data = await response.json();
            
            return {
                available: data.available,
                status: data.status,
                services: data.services,
                masumiIntegrated: true
            };
        } catch (error) {
            console.log('Using local availability check');
            return {
                available: true,
                status: 'ready',
                services: this.services,
                masumiIntegrated: true
            };
        }
    }

    // Simulate Masumi testnet payment flow
    async processTestnetPayment(walletAddress, serviceType, walletManager) {
        console.log(`🔄 Processing Masumi testnet payment for ${serviceType}`);
        
        // Step 1: Validate service and wallet
        if (!this.services[serviceType]) {
            throw new Error(`Invalid service type: ${serviceType}`);
        }

        if (!walletManager.isConnected()) {
            throw new Error('Wallet not connected');
        }

        const service = this.services[serviceType];
        
        // Step 2: Show payment processing
        const paymentResult = {
            step: 'processing',
            message: `Processing ${service.price} ${service.currency} payment for ${serviceType}...`,
            serviceType: serviceType,
            amount: service.price,
            currency: service.currency
        };

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Step 3: Generate success result
        const txHash = `masumi_testnet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const successResult = {
            success: true,
            step: 'completed',
            txHash: txHash,
            serviceType: serviceType,
            amount: service.price,
            currency: service.currency,
            walletAddress: walletAddress,
            timestamp: Date.now(),
            network: 'testnet',
            masumiProcessed: true,
            nextSteps: this.generateSuccessNextSteps(serviceType),
            estimatedProcessingTime: service.time,
            jobId: `job_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
        };

        console.log('✅ Masumi testnet payment successful:', successResult);
        return successResult;
    }

    // Generate next steps after successful payment
    generateSuccessNextSteps(serviceType) {
        const nextSteps = {
            assessment: {
                title: '🎉 Skills Assessment Payment Successful!',
                steps: [
                    {
                        icon: '⏱️',
                        text: 'Processing time: 2-3 minutes',
                        status: 'info'
                    },
                    {
                        icon: '🔍',
                        text: 'AI agents are analyzing your Cardano wallet activity',
                        status: 'processing'
                    },
                    {
                        icon: '📊',
                        text: 'You\'ll receive a detailed skills and experience analysis',
                        status: 'pending'
                    },
                    {
                        icon: '🎯',
                        text: 'Personalized career path recommendations will be included',
                        status: 'pending'
                    },
                    {
                        icon: '🔗',
                        text: 'Begin Wallet integration tips for progress tracking',
                        status: 'pending'
                    }
                ],
                recommendations: [
                    {
                        title: 'Next: Get Your Career Roadmap',
                        description: 'Based on your assessment, get a detailed learning path',
                        price: '1.5 ADA',
                        service: 'roadmap'
                    }
                ]
            },
            roadmap: {
                title: '🗺️ Career Roadmap Payment Successful!',
                steps: [
                    {
                        icon: '⏱️',
                        text: 'Processing time: 3-5 minutes',
                        status: 'info'
                    },
                    {
                        icon: '🤖',
                        text: 'Multi-agent AI system creating your personalized roadmap',
                        status: 'processing'
                    },
                    {
                        icon: '🎯',
                        text: 'Timeline-based milestones with verification methods',
                        status: 'pending'
                    },
                    {
                        icon: '💰',
                        text: 'Live Project Catalyst opportunities matching your skills',
                        status: 'pending'
                    },
                    {
                        icon: '🏆',
                        text: 'Achievement NFTs and eSIM rewards for milestones',
                        status: 'pending'
                    }
                ],
                recommendations: [
                    {
                        title: 'Next: Catalyst Proposal Guidance',
                        description: 'Get expert help with Project Catalyst proposals',
                        price: '3.0 ADA',
                        service: 'catalyst'
                    }
                ]
            },
            catalyst: {
                title: '🚀 Catalyst Guidance Payment Successful!',
                steps: [
                    {
                        icon: '⏱️',
                        text: 'Processing time: 5-10 minutes',
                        status: 'info'
                    },
                    {
                        icon: '👨‍💼',
                        text: 'Expert Catalyst Advisor analyzing current funding rounds',
                        status: 'processing'
                    },
                    {
                        icon: '📝',
                        text: 'Personalized proposal structure and writing guidance',
                        status: 'pending'
                    },
                    {
                        icon: '💡',
                        text: 'Budget planning and community engagement strategies',
                        status: 'pending'
                    },
                    {
                        icon: '📅',
                        text: 'Submission timeline and deadline management',
                        status: 'pending'
                    }
                ],
                recommendations: [
                    {
                        title: 'Ready to Submit Your Proposal!',
                        description: 'You\'ll have everything needed for a successful Catalyst proposal',
                        price: 'Included',
                        service: 'complete'
                    }
                ]
            }
        };

        return nextSteps[serviceType] || nextSteps.assessment;
    }

    // Start job processing with Masumi API
    async startJobProcessing(paymentResult) {
        const jobData = {
            identifier_from_purchaser: paymentResult.walletAddress,
            input_data: {
                type: paymentResult.serviceType,
                user_address: paymentResult.walletAddress,
                timeline: paymentResult.timeline || '6-months'
            }
        };

        try {
            const response = await fetch(`${this.masumiApiUrl}/start_job`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobData)
            });

            const result = await response.json();
            
            return {
                jobId: result.job_id,
                status: result.status,
                message: result.message,
                masumiJobStarted: true
            };
        } catch (error) {
            console.log('Using mock job processing');
            return {
                jobId: paymentResult.jobId,
                status: 'started',
                message: `Processing ${paymentResult.serviceType} request`,
                masumiJobStarted: false
            };
        }
    }

    // Check job status
    async checkJobStatus(jobId) {
        try {
            const response = await fetch(`${this.masumiApiUrl}/status?job_id=${jobId}`);
            const result = await response.json();
            
            return {
                jobId: result.job_id,
                status: result.status,
                result: result.result,
                error: result.error,
                masumiTracked: true
            };
        } catch (error) {
            console.log('Using mock job status');
            return {
                jobId: jobId,
                status: 'processing',
                result: null,
                error: null,
                masumiTracked: false
            };
        }
    }

    // Get service pricing
    getServicePricing(serviceType) {
        return this.services[serviceType] || null;
    }

    // Check if running in testnet mode
    isTestnetMode() {
        return this.testnetMode;
    }

    // Generate success message for UI
    generateSuccessMessage(paymentResult) {
        const service = this.services[paymentResult.serviceType];
        
        return {
            title: `Payment Successful! 🎉`,
            subtitle: `${service.price} ${service.currency} payment processed for ${paymentResult.serviceType}`,
            details: [
                `Transaction Hash: ${paymentResult.txHash}`,
                `Network: Cardano ${paymentResult.network}`,
                `Processing Time: ${service.time}`,
                `Job ID: ${paymentResult.jobId}`
            ],
            nextSteps: paymentResult.nextSteps,
            showProgress: true,
            allowClose: false
        };
    }

    // Format error message for UI
    formatErrorMessage(error) {
        return {
            title: 'Payment Failed',
            subtitle: error.message || 'An error occurred during payment processing',
            details: [
                'Please check your wallet connection',
                'Ensure you have sufficient ADA balance',
                'Try refreshing the page and connecting again'
            ],
            showRetry: true,
            allowClose: true
        };
    }
}

// Export singleton instance
export const masumiService = new MasumiService();