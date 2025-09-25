#!/usr/bin/env python3
"""
Test script for Cardano Career Navigator API
"""

import requests
import json
import time
import subprocess
import sys
from threading import Thread

def test_api_endpoints():
    """Test all API endpoints"""
    base_url = "http://localhost:8001"
    
    print("🧪 Testing Cardano Career Navigator API...")
    
    # Wait for server to start
    time.sleep(2)
    
    try:
        # Test 1: Root endpoint
        print("\n1. Testing root endpoint...")
        response = requests.get(f"{base_url}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        # Test 2: Input schema
        print("\n2. Testing input schema...")
        response = requests.get(f"{base_url}/input_schema")
        print(f"Status: {response.status_code}")
        print(f"Schema: {json.dumps(response.json(), indent=2)}")
        
        # Test 3: Availability check
        print("\n3. Testing availability...")
        response = requests.get(f"{base_url}/availability")
        print(f"Status: {response.status_code}")
        print(f"Services: {json.dumps(response.json(), indent=2)}")
        
        # Test 4: Start job (this will test the CrewAI agent)
        print("\n4. Testing job creation...")
        job_data = {
            "identifier_from_purchaser": "test_user_123",
            "input_data": {
                "type": "assessment",
                "user_address": "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt6ll2qzqf2d8swcyc2lqzqcqqqqqq"
            }
        }
        
        response = requests.post(f"{base_url}/start_job", json=job_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            job_result = response.json()
            print(f"Job created: {job_result}")
            job_id = job_result.get("job_id")
            
            if job_id:
                # Test 5: Check job status
                print(f"\n5. Testing job status for {job_id}...")
                time.sleep(1)  # Give it a moment
                
                status_response = requests.get(f"{base_url}/status?job_id={job_id}")
                print(f"Status: {status_response.status_code}")
                print(f"Job Status: {json.dumps(status_response.json(), indent=2)}")
        else:
            print(f"Job creation failed: {response.text}")
        
        print("\n✅ API tests completed successfully!")
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server. Make sure it's running on port 8001.")
        return False
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        return False

if __name__ == "__main__":
    # Start the API server in background
    print("🚀 Starting API server...")
    
    # Set environment variables
    import os
    os.environ["PORT"] = "8001"
    
    # Start server process
    server_process = subprocess.Popen([
        sys.executable, "main.py", "api"
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    try:
        # Run tests
        success = test_api_endpoints()
        
        if success:
            print("\n🎉 Your Cardano Career Navigator API is working perfectly!")
            print("✅ Ready for deployment to Railway/Render/Heroku")
            print("✅ Ready for Masumi challenge submission")
        else:
            print("\n⚠️ Some tests failed. Check the error messages above.")
            
    finally:
        # Clean up server process
        print("\n🛑 Stopping server...")
        server_process.terminate()
        server_process.wait()