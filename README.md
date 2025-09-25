# Cardano Career Navigator

A modern dApp that provides personalized career guidance for the Cardano ecosystem, with special integration for Begin Wallet users. Features a sleek chatbot-style interface with full Cardano wallet integration.

## 🚀 Features

- **Modern dApp Interface**: Sleek, responsive web interface with chatbot-style interactions
- **Cardano Wallet Integration**: Connect with Nami, Eternl, Begin Wallet, and other popular wallets
- **Skills Assessment (0.1 tADA)**: AI-powered analysis of on-chain activity to determine experience level and skills
- **Career Roadmap (0.3 tADA)**: Generate personalized learning paths with milestones and resources  
- **Catalyst Guidance (0.5 tADA)**: Specialized guidance for Project Catalyst participation
- **Begin Wallet Integration**: Enhanced features including eSIM rewards and progress tracking

## 🎯 Quick Start

### Backend + Frontend (Recommended)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the web server**:
   ```bash
   npm run serve
   ```

3. **Open your browser**:
   ```
   http://localhost:8080
   ```

### Backend Only

1. **Run the demo**:
   ```bash
   npm run dev
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

## 🌐 Web Interface

The dApp features a modern, responsive interface with:

- **Home Page**: Overview of services and features
- **AI Chat Assistant**: Interactive chatbot for service requests
- **Service Cards**: Detailed service information and pricing
- **Wallet Connection**: Seamless integration with Cardano wallets
- **Payment Processing**: Direct ADA payments through connected wallets

### Using the Web Interface

1. **Connect Your Wallet**: Click "Connect Wallet" and select your preferred Cardano wallet
2. **Choose a Service**: Use the chat interface or service cards to select what you need
3. **Make Payment**: Pay directly with ADA from your connected wallet
4. **Get Results**: Receive personalized AI-generated guidance immediately

## ⚙️ Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Network Configuration
CARDANO_NETWORK=preprod
MASUMI_AGENT_ID=cardano-career-navigator

# Service Pricing (in tADA for testnet)
ASSESSMENT_PRICE=0.1
ROADMAP_PRICE=0.3
CATALYST_PRICE=0.5

# Development Settings
ENABLE_MOCK_DATA=true
SKIP_PAYMENT_VERIFICATION=true
```

## 🏗️ Architecture

### Backend Components
- **Agent Core** (`src/agent.js`): Main agent class and request processing
- **Transaction Analyzer** (`src/analyzer.js`): Analyzes user on-chain activity
- **Career Path Generator** (`src/pathGenerator.js`): Creates personalized learning roadmaps
- **Data Integration** (`src/dataIntegration.js`): Fetches Catalyst and bounty data
- **Web Server** (`src/server.js`): Express server serving API and frontend

### Frontend Components
- **Main dApp** (`src/frontend/components/CareerNavigatorDApp.js`): Core application logic
- **Chat Interface** (`src/frontend/components/ChatInterface.js`): AI chatbot interface
- **Wallet Connection** (`src/frontend/components/WalletConnection.js`): Cardano wallet integration
- **Service Cards** (`src/frontend/components/ServiceCards.js`): Service selection and payment
- **API Service** (`src/frontend/services/ApiService.js`): Backend communication
- **Wallet Manager** (`src/frontend/services/WalletManager.js`): Wallet management

## 💼 Services

### Skills Assessment (0.5 ADA)
- Analyzes transaction history to determine experience level
- Identifies technical skills and interests
- Provides Begin Wallet integration recommendations
- Suggests next steps for career development

### Career Roadmap (1.5 ADA)
- Generates personalized learning paths (3, 6, or 12 months)
- Creates milestone-based progression
- Integrates relevant Catalyst opportunities
- Includes Begin Wallet progress tracking setup

### Catalyst Guidance (3.0 ADA)
- Specialized guidance for Project Catalyst participation
- Proposal writing assistance
- Budget planning recommendations
- Community engagement strategies

## 🔗 Begin Wallet Integration

Special features for Begin Wallet users:
- **Progress Tracking**: Store learning milestones on-chain as metadata
- **eSIM Rewards**: Earn mobile data for completing milestones
- **Achievement NFTs**: Collect verifiable certificates for major accomplishments
- **Developer Tools**: Integration with development environments

## 🛠️ Development

### Available Scripts
```bash
npm run serve          # Start web server (backend + frontend)
npm run dev-server     # Start web server with auto-reload
npm run dev            # Run backend demo
npm test               # Run all tests
npm test -- --watch    # Run tests in watch mode
```

### Project Structure
```
src/
├── agent.js                    # Main agent implementation
├── analyzer.js                 # Transaction analysis
├── pathGenerator.js            # Career path generation
├── dataIntegration.js          # External data integration
├── server.js                   # Web server
├── config.js                   # Configuration management
├── demo.js                     # Demo script
├── frontend/
│   ├── components/             # React-like components
│   │   ├── CareerNavigatorDApp.js
│   │   ├── ChatInterface.js
│   │   ├── WalletConnection.js
│   │   └── ServiceCards.js
│   └── services/               # Frontend services
│       ├── ApiService.js
│       └── WalletManager.js
└── *.test.js                   # Test files

public/
├── index.html                  # Main HTML file
└── src/
    └── main.js                 # Frontend entry point
```

## 🔌 API Usage

### Web API Endpoints
```
POST /api/process       # Process service requests
GET  /api/services      # Get service information
GET  /api/status        # Get agent status
```

### Programmatic Usage
```javascript
import { CareerNavigatorAgent } from './src/agent.js';
import { config } from './src/config.js';

const agent = new CareerNavigatorAgent(config);
await agent.register();

// Skills assessment
const assessment = await agent.processRequest({
  type: 'assessment',
  userAddress: 'addr1...',
  paymentTxHash: 'tx_hash...'
});

// Career roadmap
const roadmap = await agent.processRequest({
  type: 'roadmap',
  userAddress: 'addr1...',
  timeline: '6-months',
  paymentTxHash: 'tx_hash...'
});
```

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Styling**: Clean, professional interface with Cardano branding
- **Wallet Integration**: Support for major Cardano wallets
- **Real-time Chat**: Interactive AI assistant
- **Payment Flow**: Seamless ADA payment processing
- **Progress Tracking**: Visual progress indicators
- **Error Handling**: User-friendly error messages

## 🧪 Testing

The project includes comprehensive tests:
- Unit tests for all components
- Integration tests for service flows
- Frontend component tests
- API endpoint tests

```bash
npm test                           # Run all tests
npm test -- src/roadmap.test.js    # Run specific test file
npm test -- --coverage            # Run with coverage report
```

## 🚨 Error Handling

The system includes comprehensive error handling:
- `AgentRegistrationError`: Issues with Masumi platform registration
- `InvalidRequestError`: Invalid request parameters
- `PaymentVerificationError`: Payment processing issues
- `RequestProcessingError`: General processing failures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🎉 Demo

Visit the live demo at `http://localhost:8080` after running `npm run serve` to experience the full dApp interface!