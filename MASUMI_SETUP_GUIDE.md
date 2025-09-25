# Masumi Payment Service Setup Guide

## Option 1: Quick Setup (Recommended for Challenge)

### Step 1: Install Masumi Payment Service
```bash
# Clone the Masumi payment service
git clone https://github.com/masumi-network/payment-service.git
cd payment-service

# Install dependencies
npm install

# Start the service
npm start
```

The service will run on `http://localhost:3001`

### Step 2: Access Admin Dashboard
1. Open browser: `http://localhost:3001/admin`
2. Create your selling wallet
3. Get your wallet's vkey (verification key)

### Step 3: Get Test ADA
1. Go to Cardano Faucet: https://docs.cardano.org/cardano-testnet/tools/faucet/
2. Or Masumi Dispenser: (check Masumi docs)
3. Send test ADA to your selling wallet address

### Step 4: Create API Key
1. In admin dashboard: `http://localhost:3001/admin`
2. Go to API Keys section
3. Click "Create New API Key"
4. Copy the generated key - this is your `MASUMI_API_KEY`

### Step 5: Register Your Agent
```bash
# Use the API to register your agent
curl -X POST 'http://localhost:3001/api/v1/registry' \
  -H 'Content-Type: application/json' \
  -H 'token: YOUR_API_KEY_HERE' \
  -d '{
    "name": "Cardano Career Navigator",
    "description": "AI agent for Cardano career guidance",
    "services": [
      {"name": "assessment", "price": 500000, "currency": "lovelace"},
      {"name": "roadmap", "price": 1500000, "currency": "lovelace"},
      {"name": "catalyst", "price": 3000000, "currency": "lovelace"}
    ]
  }'
```

### Step 6: Get Your Agent Identifier
```bash
# Get your registered agent info
curl -X GET 'http://localhost:3001/api/v1/registry' \
  -H 'token: YOUR_API_KEY_HERE'
```

Copy the `agentIdentifier` from the response.

## Option 2: Deploy Payment Service to Cloud

### Railway Deployment
1. Fork the Masumi payment service repo
2. Deploy to Railway
3. Set environment variables
4. Use the Railway URL instead of localhost

### Environment Variables You'll Need
```
MASUMI_API_KEY=your_generated_api_key
MASUMI_AGENT_ID=your_agent_identifier
PAYMENT_SERVICE_URL=http://localhost:3001/api/v1
SELLER_VKEY=your_wallet_verification_key
```

## Quick Test
```bash
# Test if payment service is running
curl -X GET 'http://localhost:3001/api/v1/health/' \
  -H 'accept: application/json'

# Should return: {"status": "success", "data": {"status": "ok"}}
```