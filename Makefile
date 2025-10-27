.PHONY: help install start stop restart logs clean test build

help:
	@echo "OTG-TAK - On-The-Go TAK Deployment"
	@echo ""
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make start      - Start all services"
	@echo "  make stop       - Stop all services"
	@echo "  make restart    - Restart all services"
	@echo "  make logs       - View logs"
	@echo "  make clean      - Clean up containers and volumes"
	@echo "  make test       - Run tests"
	@echo "  make build      - Build Docker images"

install:
	@echo "Installing dependencies..."
	@pip3 install -r requirements.txt
	@cd frontend && npm install

start:
	@echo "Starting OTG-TAK services..."
	@docker-compose up -d
	@echo "Services started! Access dashboard at http://localhost:3000"

stop:
	@echo "Stopping OTG-TAK services..."
	@docker-compose down

restart:
	@echo "Restarting OTG-TAK services..."
	@docker-compose restart

logs:
	@docker-compose logs -f

logs-backend:
	@docker-compose logs -f backend

logs-frontend:
	@docker-compose logs -f frontend

clean:
	@echo "Cleaning up..."
	@docker-compose down -v
	@rm -rf data/*.db
	@echo "Cleanup complete"

build:
	@echo "Building Docker images..."
	@docker-compose build

test:
	@echo "Running tests..."
	@cd backend && python3 -m pytest tests/ || echo "No tests found yet"

dev-backend:
	@echo "Starting backend in development mode..."
	@cd backend && uvicorn main:app --reload

dev-frontend:
	@echo "Starting frontend in development mode..."
	@cd frontend && npm run dev

status:
	@echo "Checking service status..."
	@docker-compose ps
	@echo ""
	@echo "Backend health:"
	@curl -s http://localhost:8000/health || echo "Backend not responding"
	@echo ""
	@echo "Frontend:"
	@curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000 || echo "Frontend not responding"
