#!/bin/bash
# To run this script in Git Bash:
# 1. Make the script executable: chmod +x init.sh
# 2. Run the script: ./init.sh

# create virtual environment if it doesn't exist 
if [ ! -d ".venv" ]; then
    python -m venv .venv
fi

# activate virtual environment
source .venv/Scripts/activate

# install dependencies
# pip install -r requirements.txt

# run the app
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000