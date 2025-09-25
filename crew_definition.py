"""
Cardano Career Navigator CrewAI Agent Definition
A specialized AI agent for personalized Cardano ecosystem career guidance
"""

from crewai import Agent, Task, Crew, Process
from crewai.tools import BaseTool
from typing import Dict, Any, List
import json
import asyncio
from datetime import datetime

class CardanoAnalysisTool(BaseTool):
    name: str = "cardano_analysis_tool"
    description: str = "Analyzes Cardano wallet transactions to determine user skills and experience"
    
    def _run(self, wallet_address: str) -> str:
        """Analyze Cardano wallet for career insights"""
        # Mock analysis for demo - in production, integrate with your existing analyzer.js
        analysis = {
            "experience_level": "intermediate",
            "transaction_count": 45,
            "technical_skills": ["staking", "defi", "nft-trading", "begin-wallet"],
            "interests": ["real-world-utility", "travel", "governance"],
            "preferred_path": "development",
            "learning_style": "hands-on"
        }
        return json.dumps(analysis)

class CatalystOpportunityTool(BaseTool):
    name: str = "catalyst_opportunity_tool"
    description: str = "Fetches current Project Catalyst opportunities matching user profile"
    
    def _run(self, user_skills: str, experience_level: str) -> str:
        """Get relevant Catalyst opportunities"""
        # Mock opportunities - integrate with your dataIntegration.js
        opportunities = [
            {
                "round": "Fund 12",
                "category": "Developer Tools",
                "budget": "50000 ADA",
                "deadline": "2025-02-15",
                "match_reason": "development skills"
            },
            {
                "round": "Fund 12", 
                "category": "Real World Adoption",
                "budget": "75000 ADA",
                "deadline": "2025-02-15",
                "match_reason": "begin-wallet integration"
            }
        ]
        return json.dumps(opportunities)

class BeginWalletIntegrationTool(BaseTool):
    name: str = "begin_wallet_tool"
    description: str = "Generates Begin Wallet specific integration tips and eSIM rewards"
    
    def _run(self, user_profile: str) -> str:
        """Generate Begin Wallet integration recommendations"""
        tips = [
            {
                "category": "progress-tracking",
                "title": "Track Learning On-Chain",
                "description": "Use Begin Wallet metadata to store milestone achievements",
                "benefit": "Verifiable proof of learning progress"
            },
            {
                "category": "esim-rewards",
                "title": "Earn Data Rewards",
                "description": "Complete milestones to earn mobile data through Begin Wallet",
                "benefit": "Real-world utility from learning achievements"
            }
        ]
        return json.dumps(tips)

class CareerNavigatorCrew:
    def __init__(self):
        # Initialize tools
        self.cardano_tool = CardanoAnalysisTool()
        self.catalyst_tool = CatalystOpportunityTool()
        self.begin_wallet_tool = BeginWalletIntegrationTool()
        
        # Define agents
        self.career_analyst = Agent(
            role='Cardano Career Analyst',
            goal='Analyze user on-chain activity to determine career readiness and skills',
            backstory="""You are an expert in analyzing Cardano blockchain transactions 
            to understand user behavior, skills, and experience levels. You specialize in 
            identifying patterns that indicate technical proficiency and career interests.""",
            tools=[self.cardano_tool],
            verbose=True
        )
        
        self.roadmap_generator = Agent(
            role='Career Roadmap Specialist',
            goal='Create personalized learning paths with actionable milestones',
            backstory="""You are a career guidance expert specializing in the Cardano ecosystem. 
            You create detailed, timeline-based learning paths that help users progress from 
            their current level to their career goals.""",
            tools=[self.catalyst_tool, self.begin_wallet_tool],
            verbose=True
        )
        
        self.catalyst_advisor = Agent(
            role='Project Catalyst Expert',
            goal='Provide specialized guidance for Catalyst proposal creation and submission',
            backstory="""You are a Project Catalyst veteran who has successfully submitted 
            multiple funded proposals. You understand the nuances of proposal writing, 
            community engagement, and the funding process.""",
            tools=[self.catalyst_tool],
            verbose=True
        )
        
        # Define the crew
        self.crew = Crew(
            agents=[self.career_analyst, self.roadmap_generator, self.catalyst_advisor],
            tasks=[],  # Tasks will be created dynamically based on service type
            process=Process.sequential,
            verbose=True
        )
    
    def create_assessment_task(self, user_address: str) -> Task:
        """Create task for skills assessment service"""
        return Task(
            description=f"""
            Analyze the Cardano wallet address {user_address} to provide a comprehensive 
            skills assessment. Include:
            1. Experience level determination (beginner/intermediate/advanced)
            2. Technical skills identification from transaction patterns
            3. Interest areas based on on-chain activity
            4. Preferred career path recommendation
            5. Begin Wallet integration opportunities
            6. Next steps recommendations
            
            Provide actionable insights that help the user understand their current 
            position in the Cardano ecosystem and potential career directions.
            """,
            agent=self.career_analyst,
            expected_output="Detailed JSON assessment with experience level, skills, interests, and recommendations"
        )
    
    def create_roadmap_task(self, user_address: str, timeline: str) -> Task:
        """Create task for career roadmap generation"""
        return Task(
            description=f"""
            Generate a comprehensive {timeline} career roadmap for wallet {user_address}.
            Include:
            1. Timeline-based milestones with specific deadlines
            2. Learning resources specific to Cardano ecosystem
            3. Current Project Catalyst opportunities
            4. Begin Wallet integration tips for progress tracking
            5. Achievement NFT opportunities
            6. eSIM reward integration where applicable
            7. Verification methods for each milestone
            
            Create a practical, actionable plan that guides the user step-by-step 
            toward their career goals in the Cardano ecosystem.
            """,
            agent=self.roadmap_generator,
            expected_output="Detailed roadmap with milestones, resources, opportunities, and Begin Wallet integration"
        )
    
    def create_catalyst_task(self, user_address: str) -> Task:
        """Create task for Catalyst guidance service"""
        return Task(
            description=f"""
            Provide specialized Project Catalyst guidance for wallet {user_address}.
            Include:
            1. Readiness assessment for Catalyst participation
            2. Current funding rounds and relevant categories
            3. Proposal structure and key components
            4. Budget planning and timeline recommendations
            5. Community engagement strategies
            6. Begin Wallet integration for proposal tracking
            7. Submission timeline and deadlines
            
            Focus on practical, actionable advice that increases the likelihood 
            of successful proposal submission and funding.
            """,
            agent=self.catalyst_advisor,
            expected_output="Comprehensive Catalyst guidance with proposal strategy and current opportunities"
        )
    
    def process_request(self, service_type: str, user_address: str, timeline: str = None) -> Dict[str, Any]:
        """Process different types of service requests"""
        
        # Create appropriate task based on service type
        if service_type == "assessment":
            task = self.create_assessment_task(user_address)
        elif service_type == "roadmap":
            if not timeline:
                timeline = "6-months"  # Default timeline
            task = self.create_roadmap_task(user_address, timeline)
        elif service_type == "catalyst":
            task = self.create_catalyst_task(user_address)
        else:
            raise ValueError(f"Unknown service type: {service_type}")
        
        # Update crew with the specific task
        self.crew.tasks = [task]
        
        # Execute the crew
        result = self.crew.kickoff()
        
        # Format response
        return {
            "success": True,
            "service": service_type,
            "user_address": user_address,
            "timeline": timeline,
            "result": str(result),
            "timestamp": datetime.now().isoformat(),
            "agent_id": "cardano-career-navigator"
        }

# Create the crew instance
career_navigator_crew = CareerNavigatorCrew()