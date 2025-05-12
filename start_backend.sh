#!/bin/bash

# Activate virtual environment or create one if it doesn't exist
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt

# Run the Flask app
export FLASK_APP=backend.py
export FLASK_ENV=development
flask run --port=5000
