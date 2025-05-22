#!/bin/bash

# Install dependencies
npm install

# Install backend dependencies
cd server
pip install -r requirements.txt

# Create a .env file with your Spotify API credentials
if [ ! -f ../.env ]; then
  echo "Please enter your Spotify API credentials:"
  read -p "Client ID: " client_id
  read -p "Client Secret: " client_secret
  echo "VITE_CLIENT_ID=\"$client_id\"" > ../.env
  echo "VITE_CLIENT_SECRET=\"$client_secret\"" >> ../.env
fi

# Start the development server
cd ..
npm run start &
python server/index.py &