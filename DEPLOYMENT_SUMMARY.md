# Cardano Career Navigator - Masumi Challenge Submission

## Quick Start Guide

### 1. Setup Environment
```bash
pip install -r requirements.txt
cp .env.example .env
# Add your OPENAI_API_KEY to .env file
```

### 2. Test Locally
```bash
python main.py          # Test mode
python main.py api      # API server on port 8000
```

### 3. Deploy Options

#### Railway (Recommended)
1. Push to GitHub
2. Connect to Railway
3. Set OPENAI_API_KEY environment variable
4. Deploy automatically

#### Render
1. Connect GitHub repo
2. Set environment variables
3. Deploy as web service

#### Heroku
1. Create Heroku app
2. Set config vars
3. Deploy with git

## Services & Pricing

- **Skills Assessment**: 0.5 ADA - Analyze wallet for career insights
- **Career Roadmap**: 1.5 ADA - Personalized learning path
- **Catalyst Guidance**: 3.0 ADA - Project proposal help

## API Endpoints

- `GET /` - Agent info
- `GET /input_schema` - Input requirements
- `GET /availability` - Service status
- `POST /start_job` - Start AI task
- `GET /status?job_id=<id>` - Check job status


## Unique Features

1. **CrewAI Multi-Agent System** - Specialized agents for different tasks
2. **Cardano Ecosystem Focus** - Deep integration with Cardano tools
3. **Begin Wallet Integration** - eSIM rewards and metadata tracking
4. **Real-World Utility** - Earn mobile data for learning progress
5. **Live Data** - Current Catalyst opportunities and bounties

Your agent is ready to compete in the Masumi challenge!
