"""
Cardano Career Navigator - Masumi AI Agent
FastAPI application following MIP-003 standard
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
import uuid
import asyncio
from datetime import datetime
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our CrewAI agent
from crew_definition import career_navigator_crew

# Pydantic models for API
class ServiceRequest(BaseModel):
    identifier_from_purchaser: str = Field(..., description="Purchaser identifier")
    input_data: Dict[str, Any] = Field(..., description="Service input data")

class JobStatus(BaseModel):
    job_id: str
    status: str
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class InputSchema(BaseModel):
    type: str = Field(..., description="Service type: assessment, roadmap, or catalyst")
    user_address: str = Field(..., description="Cardano wallet address")
    timeline: Optional[str] = Field(None, description="Timeline for roadmap: 3-months, 6-months, 12-months")

# Global job storage (use database in production)
jobs: Dict[str, JobStatus] = {}

# FastAPI app
app = FastAPI(
    title="Cardano Career Navigator",
    description="AI agent providing personalized Cardano ecosystem career guidance",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Cardano Career Navigator AI Agent",
        "version": "1.0.0",
        "services": ["assessment", "roadmap", "catalyst"],
        "status": "active"
    }

@app.get("/input_schema")
async def get_input_schema():
    """Return input requirements for the agent"""
    return {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "enum": ["assessment", "roadmap", "catalyst"],
                "description": "Type of service requested"
            },
            "user_address": {
                "type": "string",
                "description": "Cardano wallet address for analysis"
            },
            "timeline": {
                "type": "string",
                "enum": ["3-months", "6-months", "12-months"],
                "description": "Timeline for roadmap service (optional for other services)"
            }
        },
        "required": ["type", "user_address"]
    }

@app.get("/availability")
async def check_availability():
    """Check if the agent is available to process requests"""
    return {
        "available": True,
        "status": "ready",
        "services": {
            "assessment": {"price": "0.5 ADA", "estimated_time": "2-3 minutes"},
            "roadmap": {"price": "1.5 ADA", "estimated_time": "3-5 minutes"},
            "catalyst": {"price": "3.0 ADA", "estimated_time": "5-10 minutes"}
        }
    }

@app.post("/start_job")
async def start_job(request: ServiceRequest, background_tasks: BackgroundTasks):
    """Start a new AI task"""
    job_id = str(uuid.uuid4())
    
    # Validate input data
    try:
        input_data = request.input_data
        service_type = input_data.get("type")
        user_address = input_data.get("user_address")
        timeline = input_data.get("timeline")
        
        if not service_type or service_type not in ["assessment", "roadmap", "catalyst"]:
            raise HTTPException(status_code=400, detail="Invalid service type")
        
        if not user_address:
            raise HTTPException(status_code=400, detail="user_address is required")
            
        if service_type == "roadmap" and not timeline:
            timeline = "6-months"  # Default timeline
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input data: {str(e)}")
    
    # Create job entry
    jobs[job_id] = JobStatus(
        job_id=job_id,
        status="pending",
        result=None,
        error=None
    )
    
    # Start background processing
    background_tasks.add_task(process_job, job_id, service_type, user_address, timeline)
    
    return {
        "job_id": job_id,
        "status": "started",
        "message": f"Processing {service_type} request for {user_address}"
    }

@app.get("/status")
async def get_job_status(job_id: str):
    """Check job status"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return jobs[job_id]

@app.post("/provide_input")
async def provide_additional_input(job_id: str, additional_data: Dict[str, Any]):
    """Provide additional input for a running job"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    if job.status != "waiting_for_input":
        raise HTTPException(status_code=400, detail="Job is not waiting for input")
    
    # Update job with additional data and resume processing
    job.status = "processing"
    return {"message": "Additional input provided, resuming processing"}

async def process_job(job_id: str, service_type: str, user_address: str, timeline: str = None):
    """Background task to process the job"""
    try:
        jobs[job_id].status = "processing"
        
        # Process with CrewAI
        result = career_navigator_crew.process_request(service_type, user_address, timeline)
        
        jobs[job_id].status = "completed"
        jobs[job_id].result = result
        
    except Exception as e:
        jobs[job_id].status = "failed"
        jobs[job_id].error = str(e)

if __name__ == "__main__":
    import uvicorn
    
    if len(sys.argv) > 1 and sys.argv[1] == "api":
        # Run API server
        port = int(os.getenv("PORT", 8000))
        uvicorn.run(app, host="0.0.0.0", port=port)
    else:
        # Test mode
        print("Testing Cardano Career Navigator...")
        test_input = {
            "type": "assessment",
            "user_address": "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt6ll2qzqf2d8swcyc2lqzqcqqqqqq"
        }
        result = career_navigator_crew.process_request(
            test_input["type"], 
            test_input["user_address"]
        )
        print("\nTest Result:")
        print(result)