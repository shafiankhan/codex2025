# Cardano Career Navigator - CrewAI AI Agent

🏆 **Winner of Masumi Network Challenge** - A professional-grade AI agent providing personalized Cardano ecosystem career guidance.

**Live Demo**: https://web-production-d0e02.up.railway.app

A sophisticated multi-agent AI system built with CrewAI that combines Web2 career coaching with Web3 utility. Features both a modern dApp interface and a production-ready API for the Masumi Network.

## 🚀 Features

### 🤖 CrewAI Multi-Agent System
- **Career Analyst Agent** - Analyzes on-chain transaction patterns
- **Roadmap Generator Agent** - Creates personalized learning paths
- **Catalyst Advisor Agent** - Provides Project Catalyst guidance

### 💰 Professional Services & Pricing
- **Skills Assessment** (0.5 ADA) - Comprehensive wallet analysis in 2-3 minutes
- **Career Roadmap** (1.5 ADA) - Personalized learning path in 3-5 minutes  
- **Catalyst Guidance** (3.0 ADA) - Project proposal assistance in 5-10 minutes

### 🌟 Unique Value Propositions
- **Begin Wallet Integration** - eSIM data rewards for learning milestones
- **On-chain Achievement NFTs** - Verifiable learning certificates
- **Real-time Catalyst Opportunities** - Live funding round matching
- **Modern dApp Interface** - Sleek, responsive web interface with chatbot-style interactions
- **Production API** - MIP-003 compliant endpoints for Masumi Network

## 🎯 Quick Start

### CrewAI API (Production)

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Add your OPENAI_API_KEY
   ```

3. **Test locally**:
   ```bash
   python main.py          # Test mode
   python main.py api      # API server
   python test_api.py      # Run API tests
   ```

4. **Access live API**:
   ```
   https://web-production-d0e02.up.railway.app
   ```

### dApp Interface (Development)

1. **Install Node.js dependencies**:
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

## 📡 API Endpoints (Production)

### Core Endpoints
- `GET /` - Agent information and status
- `GET /availability` - Service availability and pricing
- `GET /input_schema` - Input requirements schema
- `POST /start_job` - Start AI processing task
- `GET /status?job_id=<id>` - Check job status

### Example API Response
```json
{
  "available": true,
  "status": "ready",
  "services": {
    "assessment": {
      "price": "0.5 ADA",
      "estimated_time": "2-3 minutes"
    },
    "roadmap": {
      "price": "1.5 ADA", 
      "estimated_time": "3-5 minutes"
    },
    "catalyst": {
      "price": "3.0 ADA",
      "estimated_time": "5-10 minutes"
    }
  }
}
```

## 🌐 Web Interface (Development)

The dApp features a modern, responsive interface with:

- **Home Page**: Overview of services and features
- **AI Chat Assistant**: Interactive chatbot for service requests
- **Service Cards**: Detailed service information and pricing
- **Wallet Connection**: Seamless integration with Cardano wallets
- **Payment Processing**: Direct ADA payments through connected wallets

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

### CrewAI Multi-Agent System (Production)
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Career Analyst  │    │ Roadmap Generator│    │ Catalyst Advisor│
│                 │    │                  │    │                 │
│ • Wallet Analysis│    │ • Path Creation  │    │ • Proposal Help │
│ • Skill Detection│────│ • Milestone Plan │────│ • Funding Match │
│ • Experience Level│   │ • Resource Links │    │ • Timeline Guide│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

**Technology Stack:**
- **Framework**: CrewAI + FastAPI
- **AI**: OpenAI GPT models with specialized tools
- **Deployment**: Railway (Docker containerized)
- **API Standard**: MIP-003 compliant

### Backend Components (Development)
- **Agent Core** (`src/agent.js`): Main agent class and request processing
- **Transaction Analyzer** (`src/analyzer.js`): Analyzes user on-chain activity
- **Career Path Generator** (`src/pathGenerator.js`): Creates personalized learning roadmaps
- **Data Integration** (`src/dataIntegration.js`): Fetches Catalyst and bounty data
- **Web Server** (`src/server.js`): Express server serving API and frontend

### Frontend Components (Development)
- **Main dApp** (`src/frontend/components/CareerNavigatorDApp.js`): Core application logic
- **Chat Interface** (`src/frontend/components/ChatInterface.js`): AI chatbot interface
- **Wallet Connection** (`src/frontend/components/WalletConnection.js`): Cardano wallet integration
- **Service Cards** (`src/frontend/components/ServiceCards.js`): Service selection and payment

## 💼 Services

### Skills Assessment (0.5 ADA)
- **AI-Powered Analysis**: CrewAI Career Analyst examines transaction patterns
- **Experience Level Detection**: Beginner, Intermediate, or Advanced classification
- **Technical Skills Identification**: DeFi, NFTs, staking, governance participation
- **Begin Wallet Integration**: eSIM rewards and metadata tracking recommendations
- **Next Steps Guidance**: Personalized recommendations for career advancement

### Career Roadmap (1.5 ADA)
- **Multi-Agent Collaboration**: Roadmap Generator works with Career Analyst
- **Timeline Options**: 3, 6, or 12-month personalized learning paths
- **Milestone-Based Progression**: Clear, achievable goals with verification methods
- **Live Catalyst Integration**: Real-time Project Catalyst opportunity matching
- **Begin Wallet Progress Tracking**: On-chain milestone storage and eSIM rewards

### Catalyst Guidance (3.0 ADA)
- **Expert Catalyst Advisor**: Specialized agent for Project Catalyst success
- **Proposal Writing Assistance**: Structure, content, and presentation guidance
- **Budget Planning**: Realistic budget recommendations and justification
- **Community Engagement**: Strategies for building support and visibility
- **Submission Timeline**: Step-by-step guidance through the funding process

## 🔗 Begin Wallet Integration

Special features for Begin Wallet users:
- **Progress Tracking**: Store learning milestones on-chain as metadata
- **eSIM Rewards**: Earn mobile data for completing milestones
- **Achievement NFTs**: Collect verifiable certificates for major accomplishments
- **Developer Tools**: Integration with development environments

## 🚀 Deployment

### Railway (Production - Recommended)
1. Connect GitHub repository to Railway
2. Set environment variables:
   - `OPENAI_API_KEY=your_openai_key`
   - `PORT=8080`
3. Deploy automatically with included `railway.json`

### Alternative Platforms
- **Render**: Use included `render.yaml`
- **Heroku**: Use included `Procfile`
- **Docker**: Use included `Dockerfile`

## 🛠️ Development

### CrewAI API Scripts
```bash
python main.py          # Test CrewAI agent
python main.py api      # Start FastAPI server
python test_api.py      # Run comprehensive API tests
```

### dApp Development Scripts
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

## �  Masumi Network Challenge

This project was built for and won the Masumi Network AI Agent Challenge:

- **Challenge URL**: https://masumi.agorize-platform.com/en/challenges/india-codex-masumi-track
- **Live API**: https://web-production-d0e02.up.railway.app
- **Rewards**: ₹2000 Amazon Gift Card for first 20 deployments, $750/$450/$300 for top 3

### Competitive Advantages
1. **CrewAI Multi-Agent Architecture** - More sophisticated than single-agent systems
2. **Cardano Ecosystem Specialization** - Deep integration with Cardano tools
3. **Begin Wallet Real-World Utility** - Unique eSIM rewards create tangible value
4. **Professional API Design** - Production-ready with proper error handling
5. **Live Data Integration** - Real-time Catalyst rounds and bounty opportunities

## 🎉 Demo

- **Production API**: https://web-production-d0e02.up.railway.app
- **Local dApp**: Visit `http://localhost:8080` after running `npm run serve`
- **API Testing**: Run `python test_api.py` for comprehensive endpoint testing

---

**Built for the Masumi Network AI Agent Challenge**  
**Deployed at**: https://web-production-d0e02.up.railway.app  
**Framework**: CrewAI + FastAPI + React-style dApp