#!/bin/bash

# Check OTG-TAK System Health

echo "OTG-TAK System Health Check"
echo "============================"
echo ""

# Check Docker
echo "1. Docker Status"
if command -v docker &> /dev/null; then
    echo "   ✓ Docker installed: $(docker --version)"
    if docker ps &> /dev/null; then
        echo "   ✓ Docker daemon running"
    else
        echo "   ✗ Docker daemon not running"
    fi
else
    echo "   ✗ Docker not installed"
fi
echo ""

# Check running containers
echo "2. Running Containers"
if docker-compose ps | grep -q "Up"; then
    docker-compose ps
else
    echo "   ⚠️  No containers running"
fi
echo ""

# Check Backend
echo "3. Backend API"
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    response=$(curl -s http://localhost:8000/health)
    echo "   ✓ Backend responding"
    echo "   Response: $response"
else
    echo "   ✗ Backend not responding on http://localhost:8000"
fi
echo ""

# Check Frontend
echo "4. Frontend Dashboard"
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>&1)
if [ "$status" = "200" ]; then
    echo "   ✓ Frontend responding (HTTP $status)"
else
    echo "   ✗ Frontend not responding (HTTP $status)"
fi
echo ""

# Check Database
echo "5. Database"
if [ -f "data/otg-tak.db" ]; then
    size=$(du -h data/otg-tak.db | cut -f1)
    echo "   ✓ Database exists: $size"
else
    echo "   ⚠️  Database not found (will be created on first run)"
fi
echo ""

# Check Data Directories
echo "6. Data Directories"
for dir in qrcodes packages notes uploads; do
    if [ -d "data/$dir" ]; then
        count=$(find "data/$dir" -type f 2>/dev/null | wc -l)
        echo "   ✓ data/$dir: $count files"
    else
        echo "   ⚠️  data/$dir not found"
    fi
done
echo ""

# Check Disk Space
echo "7. Disk Space"
df -h . | tail -1 | awk '{print "   Available: " $4 " (" $5 " used)"}'
echo ""

# Check Memory
echo "8. Memory Usage"
free -h | grep Mem | awk '{print "   Total: " $2 ", Used: " $3 ", Available: " $7}'
echo ""

# Show Summary
echo "============================"
echo "Health Check Complete"
echo ""
echo "Access your dashboard:"
echo "  • http://localhost:3000"
echo ""
echo "View logs:"
echo "  • docker-compose logs -f"
echo ""
