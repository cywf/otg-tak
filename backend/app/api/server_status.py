"""
Server Status API endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import ServerMetrics
import psutil
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/current")
async def get_current_status():
    """
    Get current server status
    """
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    network = psutil.net_io_counters()
    
    return {
        "cpu": {
            "usage_percent": cpu_percent,
            "count": psutil.cpu_count()
        },
        "memory": {
            "total": memory.total,
            "available": memory.available,
            "used": memory.used,
            "percent": memory.percent
        },
        "disk": {
            "total": disk.total,
            "used": disk.used,
            "free": disk.free,
            "percent": disk.percent
        },
        "network": {
            "bytes_sent": network.bytes_sent,
            "bytes_recv": network.bytes_recv,
            "packets_sent": network.packets_sent,
            "packets_recv": network.packets_recv
        },
        "timestamp": datetime.now().isoformat()
    }

@router.get("/metrics/history")
async def get_metrics_history(
    hours: int = 24,
    db: AsyncSession = Depends(get_db)
):
    """
    Get historical metrics
    """
    cutoff_time = datetime.now() - timedelta(hours=hours)
    
    result = await db.execute(
        select(ServerMetrics)
        .where(ServerMetrics.timestamp >= cutoff_time)
        .order_by(ServerMetrics.timestamp.desc())
    )
    metrics = result.scalars().all()
    
    return [
        {
            "cpu_usage": m.cpu_usage,
            "memory_usage": m.memory_usage,
            "disk_usage": m.disk_usage,
            "network_in": m.network_in,
            "network_out": m.network_out,
            "active_connections": m.active_connections,
            "timestamp": m.timestamp.isoformat()
        }
        for m in metrics
    ]

@router.post("/metrics/record")
async def record_metrics(db: AsyncSession = Depends(get_db)):
    """
    Record current metrics to database
    """
    status = await get_current_status()
    
    metrics = ServerMetrics(
        cpu_usage=int(status["cpu"]["usage_percent"]),
        memory_usage=int(status["memory"]["percent"]),
        disk_usage=int(status["disk"]["percent"]),
        network_in=status["network"]["bytes_recv"],
        network_out=status["network"]["bytes_sent"],
        active_connections=0  # Would get from TAK server
    )
    
    db.add(metrics)
    await db.commit()
    
    return {"message": "Metrics recorded successfully"}

@router.get("/services")
async def get_services_status():
    """
    Get status of key services
    """
    return {
        "tak_server": {
            "status": "running",  # Would check actual status
            "port": 8089,
            "active_connections": 0
        },
        "traefik": {
            "status": "running",
            "https_enabled": True
        },
        "mediamtx": {
            "status": "stopped",
            "streams": 0
        },
        "tailscale": {
            "status": "connected",
            "network": "example-network"
        },
        "zerotier": {
            "status": "disconnected",
            "network": ""
        }
    }
