"""
Deployment API endpoints
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import json

from app.core.database import get_db
from app.models.models import Deployment
from app.services.deployment_service import DeploymentService

router = APIRouter()

class DeploymentConfig(BaseModel):
    name: str
    deployment_type: str  # 'local' or 'cloud'
    tak_server_config: dict
    security_config: dict
    networking_config: Optional[dict] = None
    enable_tailscale: bool = False
    enable_zerotier: bool = False
    enable_traefik: bool = True
    enable_mediamtx: bool = False

class DeploymentResponse(BaseModel):
    id: int
    name: str
    deployment_type: str
    status: str
    progress: int

@router.post("/create", response_model=DeploymentResponse)
async def create_deployment(
    config: DeploymentConfig,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Create a new deployment"""
    deployment = Deployment(
        name=config.name,
        deployment_type=config.deployment_type,
        config=config.dict(),
        status="pending",
        progress=0
    )
    db.add(deployment)
    await db.commit()
    await db.refresh(deployment)
    
    # Start deployment in background
    background_tasks.add_task(
        DeploymentService.execute_deployment,
        deployment.id,
        config.dict()
    )
    
    return DeploymentResponse(
        id=deployment.id,
        name=deployment.name,
        deployment_type=deployment.deployment_type,
        status=deployment.status,
        progress=deployment.progress
    )

@router.get("/status/{deployment_id}", response_model=DeploymentResponse)
async def get_deployment_status(
    deployment_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get deployment status"""
    result = await db.execute(
        select(Deployment).where(Deployment.id == deployment_id)
    )
    deployment = result.scalar_one_or_none()
    
    if not deployment:
        raise HTTPException(status_code=404, detail="Deployment not found")
    
    return DeploymentResponse(
        id=deployment.id,
        name=deployment.name,
        deployment_type=deployment.deployment_type,
        status=deployment.status,
        progress=deployment.progress
    )

@router.get("/list")
async def list_deployments(db: AsyncSession = Depends(get_db)):
    """List all deployments"""
    result = await db.execute(select(Deployment))
    deployments = result.scalars().all()
    
    return [
        DeploymentResponse(
            id=d.id,
            name=d.name,
            deployment_type=d.deployment_type,
            status=d.status,
            progress=d.progress
        )
        for d in deployments
    ]

@router.delete("/{deployment_id}")
async def delete_deployment(
    deployment_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a deployment"""
    result = await db.execute(
        select(Deployment).where(Deployment.id == deployment_id)
    )
    deployment = result.scalar_one_or_none()
    
    if not deployment:
        raise HTTPException(status_code=404, detail="Deployment not found")
    
    await db.delete(deployment)
    await db.commit()
    
    return {"message": "Deployment deleted successfully"}
