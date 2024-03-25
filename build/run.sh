#!/bin/bash
echo "Building frontend and backend Docker images..."


cd ../frontend
docker build -t tic-tac-toe-frontend .


cd ../backend
docker build -t tic-tac-toe-backend .

echo "Docker images built successfully."
