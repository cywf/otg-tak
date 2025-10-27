#!/bin/bash

# OTG-TAK Quick Start Script
# This script helps you get started with OTG-TAK quickly

set -e

echo "================================================"
echo "  OTG-TAK - On-The-Go TAK Deployment"
echo "  Quick Start Installation"
echo "================================================"
echo ""

# Check for required commands
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install $1 first."
        exit 1
    else
        echo "✓ $1 is installed"
    fi
}

echo "Checking prerequisites..."
check_command docker
check_command docker-compose
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created"
    echo "⚠️  Please edit .env file with your configuration before proceeding"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to exit and edit .env..."
else
    echo "✓ .env file already exists"
fi
echo ""

# Create necessary directories
echo "Creating data directories..."
mkdir -p data/qrcodes data/packages data/notes data/uploads
echo "✓ Data directories created"
echo ""

# Pull Docker images
echo "Pulling Docker images (this may take a few minutes)..."
docker-compose pull
echo "✓ Docker images pulled"
echo ""

# Start services
echo "Starting OTG-TAK services..."
docker-compose up -d
echo "✓ Services started"
echo ""

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 5

# Check service health
echo "Checking service health..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✓ Backend is running"
else
    echo "⚠️  Backend may not be ready yet. Check with: docker-compose logs backend"
fi

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✓ Frontend is running"
else
    echo "⚠️  Frontend may not be ready yet. Check with: docker-compose logs frontend"
fi
echo ""

# Show service URLs
echo "================================================"
echo "  Installation Complete!"
echo "================================================"
echo ""
echo "Access your OTG-TAK Dashboard:"
echo "  • Dashboard:  http://localhost:3000"
echo "  • API:        http://localhost:8000"
echo "  • API Docs:   http://localhost:8000/docs"
echo ""
echo "Useful commands:"
echo "  • View logs:       docker-compose logs -f"
echo "  • Stop services:   docker-compose down"
echo "  • Restart:         docker-compose restart"
echo ""
echo "Next steps:"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Navigate to Deployment to create your first TAK server"
echo "  3. Use QR Generator to create client onboarding codes"
echo ""
echo "For more information, see:"
echo "  • README.md"
echo "  • INSTALL.md"
echo "  • Documentation: http://localhost:8000/docs"
echo ""
